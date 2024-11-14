'use client'
import Image from 'next/image';

interface PolaroidProps {
    imageUrl: string;
    caption?: string;
}

const Polaroid = ({ imageUrl, caption }: PolaroidProps) => {
    return (
        <div className="bg-white p-4 shadow-lg rounded-lg" style={{ width: '250px' }}>
            <div className="relative w-full aspect-square mb-4 bg-gray-100">
                <Image
                    src={imageUrl}
                    alt={caption || "Polaroid image"}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="bg-gray-200"
                />
            </div>

            {caption && (
                <p className="text-center font-montserrat text-sm mb-2 text-gray-700">
                    {caption}
                </p>
            )}
        </div>
    );
};

export default Polaroid;
