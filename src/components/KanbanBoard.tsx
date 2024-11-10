'use client'
import { useState, useRef } from 'react';
import TaskCard from './TaskCard';

interface Task {
    id: string;
    title: string;
    description: string;
    tags?: string[];
}

interface Column {
    title: string;
    tasks: Task[];
}

const initialColumns: Column[] = [
    {
        title: 'Backlog',
        tasks: [
            {
                id: '1',
                title: 'Research Design Systems',
                description: 'Look into popular design systems and their implementation',
                tags: ['research', 'design']
            },
            {
                id: '2',
                title: 'Mobile Responsiveness',
                description: 'Ensure all components work on mobile devices',
                tags: ['mobile', 'UI']
            }
        ]
    },
    {
        title: 'To Do',
        tasks: [
            {
                id: '3',
                title: 'Set Up Analytics',
                description: 'Implement Google Analytics and event tracking',
                tags: ['analytics', 'setup']
            },
            {
                id: '4',
                title: 'SEO Optimization',
                description: 'Optimize meta tags and site structure',
                tags: ['seo']
            }
        ]
    },
    {
        title: 'Doing',
        tasks: [
            {
                id: '5',
                title: 'Portfolio Layout',
                description: 'Design and implement the main portfolio layout',
                tags: ['design', 'in-progress']
            },
            {
                id: '6',
                title: 'Animation System',
                description: 'Implement smooth transitions and animations',
                tags: ['animation']
            }
        ]
    },
    {
        title: 'Done',
        tasks: [
            {
                id: '7',
                title: 'Initial Setup',
                description: 'Set up Next.js project with basic configuration',
                tags: ['setup', 'completed']
            },
            {
                id: '8',
                title: 'Dark Mode',
                description: 'Implement dark mode functionality',
                tags: ['feature', 'UI']
            }
        ]
    }
];

export default function KanbanBoard() {
    const [columns, setColumns] = useState(initialColumns);
    const boardRef = useRef<HTMLDivElement>(null);

    const moveTask = (taskId: string, fromColumn: number, toColumn: number) => {
        const newColumns = [...columns];
        const task = newColumns[fromColumn].tasks.find(t => t.id === taskId);

        if (task) {
            newColumns[fromColumn].tasks = newColumns[fromColumn].tasks.filter(t => t.id !== taskId);
            newColumns[toColumn].tasks.push(task);
            setColumns(newColumns);
        }
    };

    const handleTaskDragEnd = (columnIndex: number, taskId: string, e: any, data: any) => {
        if (!boardRef.current) return;

        // Get board position and dimensions
        const boardRect = boardRef.current.getBoundingClientRect();
        const columnWidth = boardRect.width / columns.length;

        // Calculate movement in terms of columns
        const movement = Math.round(data.x / columnWidth);
        const newColumnIndex = columnIndex + movement;

        // Only move if we're in a valid column
        if (newColumnIndex >= 0 && newColumnIndex < columns.length && newColumnIndex !== columnIndex) {
            moveTask(taskId, columnIndex, newColumnIndex);
        }
    };

    return (
        <div
            ref={boardRef}
            className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex gap-4 scale-75"
        >
            {columns.map((column, columnIndex) => (
                <div
                    key={columnIndex}
                    className="w-56 bg-gray-50 dark:bg-[#1F1F1F] rounded-lg p-3"
                >
                    <h2 className="font-montserrat font-medium text-sm text-gray-600 dark:text-gray-400 tracking-wide">
                        {column.title}
                    </h2>
                    <div className="flex flex-col gap-2 mt-3">
                        {column.tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                title={task.title}
                                description={task.description}
                                tags={task.tags}
                                onDragEnd={(e, data) =>
                                    handleTaskDragEnd(columnIndex, task.id, e, data)
                                }
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
} 