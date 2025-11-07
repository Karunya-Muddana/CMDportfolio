import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function MatrixBackground() {
  const canvasBackRef = useRef<HTMLCanvasElement>(null);
  const canvasFrontRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isIdle, setIsIdle] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 30, damping: 30 });

  // Track mouse movement with smooth inertia
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsIdle(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Track device tilt (mobile)
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        const x = (e.gamma / 90) * 20;
        const y = (e.beta / 90) * 20;
        setTilt({ x, y });
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  // Idle detection (5s)
  useEffect(() => {
    const idleTimer = setTimeout(() => {
      setIsIdle(true);
    }, 5000);

    return () => clearTimeout(idleTimer);
  }, [mousePosition]);

  // Background layer: smaller, faster drift
  useEffect(() => {
    const canvas = canvasBackRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01アイウエオカキクケコサシスセソタチツテト';
    const fontSize = 12;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    let animationFrame: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(27, 27, 27, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const isGold = i % 8 === 0;
        ctx.fillStyle = isGold ? 'rgba(248, 180, 0, 0.04)' : 'rgba(0, 255, 136, 0.03)';

        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }

        drops[i] += 0.5; // Faster fall
      }

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Foreground layer: larger, slower drift
  useEffect(() => {
    const canvas = canvasFrontRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01アイウエオカキクケコサシスセソタチツテト';
    const fontSize = 18;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    let animationFrame: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(27, 27, 27, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const isGold = i % 6 === 0;
        ctx.fillStyle = isGold ? 'rgba(248, 180, 0, 0.06)' : 'rgba(0, 255, 136, 0.05)';

        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += 0.2; // Slower fall
      }

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {/* Background parallax layer - faster, smaller */}
      <motion.canvas
        ref={canvasBackRef}
        className="fixed inset-0 pointer-events-none z-5"
        style={{
          x: useSpring(tilt.x || smoothMouseX, { stiffness: 35, damping: 25 }),
          y: useSpring(tilt.y || smoothMouseY, { stiffness: 35, damping: 25 }),
          filter: 'blur(4px)',
          opacity: 0.15,
        }}
      />

      {/* Foreground parallax layer - slower, larger */}
      <motion.canvas
        ref={canvasFrontRef}
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          x: useSpring(tilt.x || smoothMouseX, { stiffness: 50, damping: 30 }),
          y: useSpring(tilt.y || smoothMouseY, { stiffness: 50, damping: 30 }),
          filter: 'blur(3px)',
          opacity: 0.15,
        }}
      />

      {/* Idle gold data rain - appears every 5s */}
      {isIdle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed pointer-events-none z-20"
          style={{
            left: mousePosition.x,
            top: 0,
            width: 2,
            height: '100%',
          }}
        >
          <motion.div
            className="w-full h-32 bg-gradient-to-b from-[#F8B400]/25 via-[#F8B400]/10 to-transparent"
            style={{
              filter: 'blur(1px)',
              boxShadow: '0 0 12px rgba(248, 180, 0, 0.2)',
            }}
            animate={{
              y: [0, window.innerHeight],
            }}
            transition={{
              duration: 1,
              ease: 'linear',
              repeat: Infinity,
              repeatDelay: 4,
            }}
          />
        </motion.div>
      )}
    </>
  );
}
