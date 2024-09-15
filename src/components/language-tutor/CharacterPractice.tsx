"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Message } from "./types";
import { toast } from "sonner";

interface CharacterPracticeProps {
  message: Message;
}

export function CharacterPractice({ message }: CharacterPracticeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const character = useMemo(
    () => message.content.character,
    [message.content.character]
  );

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        context.strokeStyle = "black";
        context.lineWidth = 2;
        drawBackgroundCharacter(context, character?.hanzi || "一");
      }
    }
  }, [character]);

  const drawBackgroundCharacter = (
    context: CanvasRenderingContext2D,
    char: string
  ) => {
    context.globalAlpha = 0.2;
    context.font = "150px sans-serif";
    context.fillText(char, 25, 150);
    context.globalAlpha = 1;
  };

  const handleDrawStart = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        const rect = canvas.getBoundingClientRect();
        const x =
          ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
        const y =
          ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;
        context.beginPath();
        context.moveTo(x, y);
      }
    }
  };

  const handleDrawMove = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        const rect = canvas.getBoundingClientRect();
        const x =
          ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
        const y =
          ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;
        context.lineTo(x, y);
        context.stroke();
      }
    }
  };

  const handleDrawEnd = () => {
    setIsDrawing(false);
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBackgroundCharacter(context, character?.hanzi || "一");
      }
    }
  };

  const handleSubmit = () => {
    toast.warning("Feature not implemented yet");
    // const canvas = canvasRef.current;
    // if (canvas) {
    //   const dataURL = canvas.toDataURL();
    //   onAnswerSubmit(dataURL);
    // }
  };

  return (
    <div className="mt-4">
      <p className="whitespace-pre-line">{message.content.text}</p>
      <p>{character?.hanzi}</p>
      <p className="text-2xl mb-2">{character?.hanzi}</p>
      <p>
        {character?.pinyin} - {character?.meaning}
      </p>
      <p>{character?.etymology}</p>
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        className="border border-gray-300 mt-2"
        onMouseDown={handleDrawStart}
        onMouseMove={handleDrawMove}
        onMouseUp={handleDrawEnd}
        onMouseLeave={handleDrawEnd}
        onTouchStart={handleDrawStart}
        onTouchMove={handleDrawMove}
        onTouchEnd={handleDrawEnd}
      />
      <Button onClick={handleClearCanvas} className="mt-2 mr-2">
        Clear
      </Button>
      <Button onClick={handleSubmit} className="mt-2">
        Submit
      </Button>
    </div>
  );
}
