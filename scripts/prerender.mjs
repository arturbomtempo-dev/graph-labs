import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const distDir = path.join(root, 'dist');
const serverEntry = path.join(root, 'dist-ssr', 'entry-server.js');

const { render, prerenderPaths, NOT_FOUND_PATH, createSitemap } = await import(
    pathToFileURL(serverEntry).href
);

const template = await readFile(path.join(distDir, 'index.html'), 'utf8');
const manifest = JSON.parse(await readFile(path.join(distDir, '.vite', 'manifest.json'), 'utf8'));

function collectChunk(key, files) {
    const chunk = manifest[key];
    if (!chunk || files.has(chunk.file)) return files;
    files.add(chunk.file);
    (chunk.imports ?? []).forEach((child) => collectChunk(child, files));
    return files;
}

function dictionaryPreloads(locale) {
    const files = collectChunk(`src/i18n/locales/${locale}/index.ts`, new Set());
    if (files.size === 0) throw new Error(`No build chunk found for the "${locale}" dictionary.`);
    return [...files].map((file) => `<link rel="modulepreload" crossorigin href="/${file}" />`);
}

function outputFile(route) {
    if (route === '/') return path.join(distDir, 'index.html');
    if (route === NOT_FOUND_PATH) return path.join(distDir, '404.html');
    return path.join(distDir, route.slice(1), 'index.html');
}

const seoTag =
    /<title\b[^>]*\bdata-seo\b[^>]*>[\s\S]*?<\/title>|<(?:meta|link)\b[^>]*\bdata-seo\b[^>]*>/g;

async function prerender(route) {
    const page = await render(route);
    const head = [page.headTags, ...dictionaryPreloads(page.locale)].join('\n        ');
    const document = template
        .replace(/<html lang="[^"]*">/, `<html lang="${page.lang}">`)
        .replace(seoTag, '')
        .replace(/\n\s*\n(\s*\n)+/g, '\n\n')
        .replace('</head>', `    ${head}\n    </head>`)
        .replace(
            '<div id="root"></div>',
            `<div id="root" data-prerendered-path="${page.hydrate ? route : ''}">${page.html}</div>`
        );

    const file = outputFile(route);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, document);
    return path.relative(distDir, file);
}

async function assertHostingRewrites() {
    const vercel = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'));
    const rewritten = new Set((vercel.rewrites ?? []).map((rewrite) => rewrite.source));
    const missing = prerenderPaths.filter(
        (route) => route !== '/' && route !== NOT_FOUND_PATH && !rewritten.has(route)
    );
    if (missing.length > 0) {
        throw new Error(`vercel.json is missing rewrites for: ${missing.join(', ')}`);
    }
}

await assertHostingRewrites();
const written = [];
for (const route of prerenderPaths) written.push(await prerender(route));
await writeFile(path.join(distDir, 'sitemap.xml'), createSitemap());
await rm(path.join(distDir, '.vite'), { recursive: true, force: true });

console.log(`Prerendered ${written.length} pages and sitemap.xml:`);
written.forEach((file) => console.log(`  dist/${file}`));
