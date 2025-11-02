import React, { useState, useEffect } from "react";

// Define interface for slice glitches
interface SliceGlitch {
  top: string;
  height: string;
  offsetX: number;
  offsetY: number;
  color: string;
}

export default function NitroText({ className = "" }) {
  const [outlineColor, setOutlineColor] = useState("#8cffff"); // Paler cyan
  const [glitchActive, setGlitchActive] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [sliceGlitches, setSliceGlitches] = useState<SliceGlitch[]>([]);

  // Outline colors - using paler versions
  const colors = ["#8cffff80", "#ffb6e180"]; // Pale cyan and pale pink with reduced opacity

  // Generate text slice glitches
  const generateSliceGlitches = () => {
    const slices: SliceGlitch[] = [];
    const sliceCount = Math.floor(Math.random() * 3) + 2; // 2-4 slices

    for (let i = 0; i < sliceCount; i++) {
      slices.push({
        top: `${Math.floor(Math.random() * 85) + 5}%`,
        height: `${Math.floor(Math.random() * 8) + 2}px`,
        offsetX: Math.random() * 10 - 5,
        offsetY: Math.random() * 6 - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return slices;
  };

  // Calculate distortion values
  const triggerGlitch = () => {
    // Switch colors
    setOutlineColor((prevColor) =>
      prevColor === colors[0] ? colors[1] : colors[0]
    );

    // Set distortion values
    setOffsetX(Math.random() * 8 - 4);
    setOffsetY(Math.random() * 6 - 3);
    setRotation((Math.random() * 1.6 - 0.8) * (Math.random() > 0.7 ? 1 : 0));

    // Generate slice glitches
    setSliceGlitches(generateSliceGlitches());

    // Activate glitch
    setGlitchActive(true);

    // Deactivate after short duration
    const duration = Math.floor(Math.random() * 200) + 100; // 100-300ms
    setTimeout(() => {
      setGlitchActive(false);
    }, duration);
  };

  useEffect(() => {
    // Schedule glitches at random intervals
    const scheduleNextGlitch = () => {
      const nextDelay = Math.floor(Math.random() * 2000) + 500; // 500-2500ms

      setTimeout(() => {
        triggerGlitch();
        scheduleNextGlitch();
      }, nextDelay);
    };

    // Start the cycle
    const initialTimer = setTimeout(scheduleNextGlitch, 1000);

    return () => clearTimeout(initialTimer);
  }, []);

  return (
    <div className={`relative ${className} p-0`}>
      {/* Main text - white fill with colored outline */}
      <div
        className="relative overflow-visible transition-transform duration-50"
        style={{
          transform: glitchActive
            ? `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`
            : "translate(0, 0) rotate(0deg)",
        }}
      >
        <h1
          className="text-3xl md:text-5xl relative font-black tracking-tight"
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
            WebkitTextStroke: `0.5px ${outlineColor}`,
            WebkitTextFillColor: "rgba(255, 255, 255, 0.9)",
            textShadow: `0 0 6px ${outlineColor}`,
            filter: glitchActive ? "brightness(1.05)" : "brightness(1)",
          }}
        >
          Nitro
        </h1>
      </div>

      {/* RGB split effect during glitch */}
      {glitchActive && (
        <>
          <h1
            className="text-3xl md:text-5xl absolute top-0 left-0 font-black tracking-tight opacity-30 mix-blend-screen"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              WebkitTextStroke: "0.5px #ffb6e180", // Pale pink with reduced opacity
              WebkitTextFillColor: "rgba(255, 255, 255, 0.9)",
              transform: `translate(${offsetX + 2}px, ${offsetY}px)`,
            }}
          >
            Nitro
          </h1>
          <h1
            className="text-3xl md:text-5xl absolute top-0 left-0 font-black tracking-tight opacity-30 mix-blend-screen"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              WebkitTextStroke: "0.5px #8cffff80", // Pale cyan with reduced opacity
              WebkitTextFillColor: "rgba(255, 255, 255, 0.9)",
              transform: `translate(${offsetX - 2}px, ${offsetY}px)`,
            }}
          >
            Nitro
          </h1>
        </>
      )}

      {/* Subtle glow */}
      <div
        className="absolute inset-0 blur-lg opacity-10 -z-10 scale-150 mix-blend-screen"
        style={{
          background: `radial-gradient(circle, ${outlineColor} 0%, transparent 70%)`,
        }}
      />

      {/* Text slice glitches */}
      {glitchActive &&
        sliceGlitches.map((slice, index) => (
          <div
            key={`slice-${index}`}
            className="absolute overflow-hidden"
            style={{
              top: slice.top,
              left: 0,
              right: 0,
              height: slice.height,
            }}
          >
            <h1
              className="text-3xl md:text-5xl absolute font-black tracking-tight"
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                WebkitTextStroke: `0.5px ${slice.color}`,
                WebkitTextFillColor: "rgba(255, 255, 255, 0.9)",
                top: `-${parseInt(slice.top)}px`,
                transform: `translate(${slice.offsetX}px, ${slice.offsetY}px)`,
                textShadow: `0 0 3px ${slice.color}`,
              }}
            >
              Nitro
            </h1>
          </div>
        ))}

      {/* Scanlines effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-2"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 1px, transparent 1px, transparent 2px)",
          backgroundSize: "100% 2px",
        }}
      />
    </div>
  );
}
