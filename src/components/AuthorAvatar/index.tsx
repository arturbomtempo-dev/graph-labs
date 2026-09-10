import { author } from '@/lib/author';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

const initials = author.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

interface AuthorAvatarProps {
    className?: string;
    fallbackClassName?: string;
}

export function AuthorAvatar({ className, fallbackClassName }: AuthorAvatarProps) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <span
                aria-hidden
                className={cn(
                    'bg-brand/12 text-brand flex items-center justify-center font-semibold',
                    className,
                    fallbackClassName
                )}
            >
                {initials}
            </span>
        );
    }

    return (
        <img
            src={author.avatarUrl}
            alt={author.name}
            width={256}
            height={256}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className={cn('bg-surface-sunken object-cover', className)}
        />
    );
}
