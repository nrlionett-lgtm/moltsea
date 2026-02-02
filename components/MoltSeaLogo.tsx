export default function MoltSeaLogo({ className = "w-8 h-8", color = "#FF5A2D" }: { className?: string, color?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className={className}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* Outer Compass Ring */}
            <circle cx="50" cy="50" r="45" strokeOpacity="0.3" />

            {/* Compass Star Points */}
            <path d="M50 5 L55 40 L90 50 L55 60 L50 95 L45 60 L10 50 L45 40 Z" fill={color} stroke="none" />

            {/* Mechanical Claw Overlay (Stylized) */}
            {/* Left Pincer */}
            <path d="M30 75 Q 10 75 10 50 Q 10 25 35 25" strokeWidth="8" stroke={color} strokeLinecap="butt" />
            {/* Right Pincer (Sharp) */}
            <path d="M70 75 Q 90 75 90 50 Q 90 25 65 25" strokeWidth="8" stroke={color} strokeLinecap="butt" />

            {/* Center Tech Dot */}
            <circle cx="50" cy="50" r="8" fill="#000" stroke={color} strokeWidth="4" />
        </svg>
    );
}
