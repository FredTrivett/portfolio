'use client'

interface LoadingScreenProps {
    isLoading: boolean;
    font: string;
}

export default function LoadingScreen({ isLoading, font }: LoadingScreenProps) {
    if (!isLoading) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-[var(--background)] flex items-center justify-center"
            id="loading-screen"
        >
            <h1 className={`text-4xl font-bold ${font}`}>Loading...</h1>
        </div>
    );
} 