interface IconProps {
    name: keyof typeof icons;
    className?: string;
}

const icons = {
    addFile: (className?: string) => (
        <svg className={className} viewBox="0 0 125 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={7}>
            {/* Outer line */}
            <path d="
                M55 150
                h 35 
                a25 25 0 0 0 25 -25
                v-65
                l-50 -50
                h-25
                a25 25 0 0 0 -25 25
                v60
            "/>
            {/* lines */}
            <path d="
                M35 50
                h 17
                M35 75
                h 60
                M55 100
                h 40
                M65 125
                h 30
            "/>
            {/* ear */}
            <path d="
                M64 11
                l0 25
                a25 25 0 0 0 25 25
                l25 0
            "/>
            {/* Arrow */}
            <path d="
                M35 105
                l-15 15
                M35 105
                v35
                M35 105
                l15 15
            "/>
        </svg>
    ),
    expand: (className?: string) => (
        <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={7}>
            <path d="
                M 10 10
                l 25 25
                M 10 10
                l 5 25
                M 10 10
                l 25 5
            "/>
            <path d="
                M 90 10
                l -25 25
                M 90 10
                l -5 25
                M 90 10
                l -25 5
            "/>
            <path d="
                M 90 90
                l -25 -25
                M 90 90
                l -5 -25
                M 90 90
                l -25 -5
            "/>
            <path d="
                M 10 90
                l 25 -25
                M 10 90
                l 5 -25
                M 10 90
                l 25 -5
            "/>
        </svg>
    ),
    file: (className?: string) => (
        <svg className={className} viewBox="0 0 125 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={7}>
            {/* Outer line */}
            <path d="
                M40 150
                h 50 
                a25 25 0 0 0 25 -25
                v-65
                l-50 -50
                h-25
                a25 25 0 0 0 -25 25
                v90
                a25 25 0 0 0 25 25
            "/>
            {/* lines */}
            <path d="
                M35 50
                h 17
                M35 75
                h 60
                M35 100
                h 60
                M35 125
                h 60
            "/>
            {/* ear */}
            <path d="
                M64 11
                l0 25
                a25 25 0 0 0 25 25
                l25 0
            "/>
        </svg>
    ),
    sucess: (className?: string) => (
        <svg className={className} viewBox="0 0 160 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={12}>
            {/* Circle */}
            <circle cx="80" cy="80" r="72" />
            {/* lines */}
            <path d="M 40 85 L 70 115 L 120 55" />
        </svg>
    ),
    warning: (className?: string) => (
        <svg className={className} viewBox="0 0 160 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={12}>
            {/* Triangle */}
            <path d="M 27 125 L 75 24 Q 80 15 85 24 L 133 125 Q 138 135 125 135 L 35 135 Q 22 135 27 125 Z" />
            {/* Exclamation line */}
            <line x1="80" y1="58" x2="80" y2="92" />
            {/* Exclamation dot */}
            <circle cx="80" cy="114" r="10" fill="currentColor" stroke="none"/>
        </svg>
    ),
    error: (className?: string) => (
        <svg className={className} viewBox="0 0 160 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={12}>
            {/* Circle */}
            <circle cx="80" cy="80" r="72" />
            {/* Exclamation line */}
            <line x1="80" y1="35" x2="80" y2="97" />
            {/* Exclamation dot */}
            <circle cx="80" cy="124" r="10" fill="currentColor" stroke="none"/>
        </svg>
    ),
    chevron: (className?: string) => (
        <svg className={className} viewBox="0 0 160 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={12}>
            {/* Circle */}
            <circle cx="80" cy="80" r="72" />
            {/* chevron line */}
            <path d="M35 65 l45 45 l45 -45" />
        </svg>
    ),
    close: (className?: string) => (
        <svg className={className} viewBox="0 0 160 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={12}>
            {/* X */}
            <path d="M8 8 l144 144 M8 144 l144 -136" />
        </svg>
    )
};

export default function Icon({ name, className }: IconProps) {
    return <>{icons[name]?.(className)}</>
}