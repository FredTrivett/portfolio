'use client'
import Draggable from 'react-draggable';
import { useRef, useEffect, useState } from 'react';

interface TaskCardProps {
    title: string;
    description: string;
    tags?: string[];
    onDragEnd?: (e: any, data: any) => void;
}

export default function TaskCard({ title, description, tags = [], onDragEnd }: TaskCardProps) {
    const nodeRef = useRef(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            const element = document.querySelector('.dot-pattern') as HTMLElement;
            const transform = element?.style.transform;
            if (transform) {
                const scaleMatch = transform.match(/scale\(([\d.]+)\)/);
                if (scaleMatch) {
                    setScale(parseFloat(scaleMatch[1]));
                }
            }
        };

        updateScale();
        const observer = new MutationObserver(updateScale);
        const element = document.querySelector('.dot-pattern');
        if (element) {
            observer.observe(element, { attributes: true, attributeFilter: ['style'] });
        }

        return () => observer.disconnect();
    }, []);

    const handleDragStart = (e: any) => {
        // Stop propagation to prevent canvas drag
        e.stopPropagation();
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        // Stop propagation to prevent canvas drag
        e.stopPropagation();
    };

    return (
        <Draggable
            nodeRef={nodeRef}
            onStop={onDragEnd}
            onStart={handleDragStart}
            position={{ x: 0, y: 0 }}
            scale={scale}
        >
            <div
                ref={nodeRef}
                onMouseDown={handleMouseDown}
                onPointerDown={(e) => e.stopPropagation()}
                className="font-montserrat bg-white dark:bg-[#2D2D2D] p-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing select-none"
            >
                <h3 className="font-montserrat font-semibold text-xs mb-1">{title}</h3>
                <p className="font-montserrat text-xs opacity-70 mb-2">{description}</p>
                <div className="flex gap-1 flex-wrap">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="font-montserrat px-2 py-0.5 rounded-full text-[10px] bg-gray-100 dark:bg-[#3D3D3D]"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </Draggable>
    );
} 