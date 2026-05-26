"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  icon: React.ReactNode;
  title: string;
  description: string;
  step: string;
};

export const GradientCard = ({ icon, title, description, step }: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setRotation({
      x: -(y / rect.height) * 6,
      y: (x / rect.width) * 6,
    });
  };

  const reset = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={reset}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full rounded-[28px] overflow-hidden",
        "border border-border bg-card",
        "backdrop-blur-xl shadow-xl"
      )}
      style={{
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
        y: isHovered ? -6 : 0,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      {/* glow background (theme safe) */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-tr from-violet-500/20 via-transparent to-blue-500/20 blur-2xl" />
      </div>

      {/* content */}
      <div className="relative p-6 sm:p-7 flex flex-col h-full">
        {/* icon */}
        <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mb-5 shadow-md">
          {icon}
        </div>

        {/* step */}
        <span className="text-xs font-semibold tracking-widest text-muted-foreground mb-2">
          STEP {step}
        </span>

        {/* title */}
        <h3 className="text-xl font-bold text-foreground mb-3 leading-snug">
          {title}
        </h3>

        {/* description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* bottom glow line */}
        <div className="mt-auto pt-6">
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
};