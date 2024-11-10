'use client'

interface ProjectProps {
    title: string;
    description: string;
    position: {
        top: string;
        left: string;
    };
}

export default function Project({ title, description, position }: ProjectProps) {
    return (
        <div
            className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 shadow-xl"
            style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
            }}
        >
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="opacity-70">{description}</p>
        </div>
    );
} 