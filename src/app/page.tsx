'use client'
import { motion, useMotionValue, useSpring, useDragControls, useTransform } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import localFont from 'next/font/local';
import LoadingScreen from "@/components/LoadingScreen";
import Project from "@/components/Project";
import Polaroid from '@/components/Polaroid';
import Image from "next/image";

// Initialize the local font
const hugeSalmon = localFont({
  src: './fonts/HugeSalmon.otf',
  display: 'swap',
});

export default function Home() {
  const dragControls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [constraints, setConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 });

  // Create a single transform value for all properties
  const transform = useMotionValue({
    x: 0,
    y: 0,
    scale: 1
  });

  // Handle drag with reduced speed
  const onDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: any) => {
    const currentTransform = transform.get();
    // Scale down the drag movement by 0.6
    transform.set({
      ...currentTransform,
      x: currentTransform.x + (info.delta.x * 0.6),
      y: currentTransform.y + (info.delta.y * 0.6)
    });
  };

  // Handle zoom with unified transform
  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();

    if (event.ctrlKey || event.metaKey) {
      const currentTransform = transform.get();
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      // Direct zoom calculation
      const zoomDelta = -event.deltaY * 0.01;
      const newScale = currentTransform.scale * (1 + zoomDelta);
      const clampedScale = Math.min(Math.max(0.1, newScale), 5);

      // Calculate new position
      const mouseXWorld = (mouseX - currentTransform.x) / currentTransform.scale;
      const mouseYWorld = (mouseY - currentTransform.y) / currentTransform.scale;

      const newX = mouseX - mouseXWorld * clampedScale;
      const newY = mouseY - mouseYWorld * clampedScale;

      // Update all transforms at once
      transform.set({
        x: newX,
        y: newY,
        scale: clampedScale
      });
    } else {
      // Handle panning
      const currentTransform = transform.get();
      transform.set({
        ...currentTransform,
        x: currentTransform.x - event.deltaX * 1.2,
        y: currentTransform.y - event.deltaY * 1.2
      });
    }
  }, []);

  // Handle touch gestures
  useEffect(() => {
    const element = document.documentElement;

    // Prevent default touch behavior
    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    element.addEventListener('touchstart', preventDefault, { passive: false });
    element.addEventListener('touchmove', preventDefault, { passive: false });

    // Add wheel event listener with passive false to prevent default
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('touchstart', preventDefault);
      element.removeEventListener('touchmove', preventDefault);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // Initial positioning effect
  useEffect(() => {
    const calculatePositioning = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const canvasWidth = 5000;
      const canvasHeight = 5000;

      setConstraints({
        left: -(canvasWidth - viewportWidth),
        right: 0,
        top: -(canvasHeight - viewportHeight),
        bottom: 0
      });

      const initialX = -(canvasWidth / 2 - viewportWidth / 2);
      const initialY = -(canvasHeight / 2 - viewportHeight / 2);

      transform.set({
        x: initialX,
        y: initialY,
        scale: 1
      });
    };

    calculatePositioning();

    setTimeout(() => {
      setIsLoading(false);
    }, 800);

    window.addEventListener('resize', calculatePositioning);
    return () => window.removeEventListener('resize', calculatePositioning);
  }, []);

  // Handle mouse/touch events for the canvas
  const startDrag = (event: React.PointerEvent) => {
    setIsDragging(true);
    dragControls.start(event);
  };

  return (
    <>
      <LoadingScreen isLoading={isLoading} font={hugeSalmon.className} />

      <div
        className={`w-screen h-screen overflow-hidden ${hugeSalmon.className}`}
        onPointerDown={startDrag}
        onPointerUp={() => setIsDragging(false)}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <motion.div
          drag
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDrag={onDrag}
          dragElastic={0}
          dragMomentum={false}
          style={{
            transform: useTransform(transform, ({ x, y, scale }) =>
              `translate3d(${x}px, ${y}px, 0) scale(${scale})`
            ),
            transformOrigin: '0 0',
          }}
          className="w-[5000px] h-[5000px] relative bg-[var(--background)] dot-pattern"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <h1 className="text-6xl font-bold">Fred Trivett</h1>
            <p className="mt-2 text-lg opacity-70">Click and drag anywhere to explore</p>
          </div>

          <Project
            title="Project 1"
            description="Description here"
            position={{ top: "47%", left: "55%" }}
          />

          <Project
            title="Project 2"
            description="Description here"
            position={{ top: "53%", left: "40%" }}
          />
          <motion.div
            className="absolute"
            style={{
              top: "40%",
              left: "40%",
              transform: "rotate(-5deg)"
            }}
            initial={{ rotate: -5 }}
            whileHover={{
              scale: 1.1,
              rotate: -2,
              transition: { duration: 0.2 }
            }}
            animate={{ rotate: -5 }}
          >
            <Polaroid
              imageUrl="/hols.jpeg"
              caption="Summer 2024"
            />
          </motion.div>


          <motion.div
            className="absolute"
            style={{
              top: "47.5%",
              left: "45%",
              transform: "rotate(-5deg)"
            }}
            whileHover={{
              scale: 1.1,
              rotate: -2,
              transition: { duration: 0.2 }
            }}
          >
            <Image
              src="/Birthday.png"
              alt="Birthday"
              width={120}
              height={120}
            />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
