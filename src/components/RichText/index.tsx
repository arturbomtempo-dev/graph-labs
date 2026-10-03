const tokenPattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;

export function RichText({ text }: { text: string }) {
    return (
        <>
            {text.split(tokenPattern).map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                        <strong key={index} className="text-ink font-medium">
                            {part.slice(2, -2)}
                        </strong>
                    );
                }
                if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
                    return <em key={index}>{part.slice(1, -1)}</em>;
                }
                if (part.startsWith('`') && part.endsWith('`')) {
                    return (
                        <code key={index} className="font-mono text-[12px]">
                            {part.slice(1, -1)}
                        </code>
                    );
                }
                return part;
            })}
        </>
    );
}
