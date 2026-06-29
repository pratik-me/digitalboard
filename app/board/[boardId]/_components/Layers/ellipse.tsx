"use client";

import { colorToCss } from "@/lib/utils";
import { Color, Layer } from "@/types/canvas";

interface EllipseProps {
  id: string;
  layer: Layer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Ellipse = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: EllipseProps) => {
  return (
    <ellipse
      className="drop-shadow-md"
      onPointerDown={(e: React.PointerEvent) => onPointerDown(e, id)}
      style={{ transform: `translate(${layer.x}px, ${layer.y}px)` }}
      cx={layer.width / 2}
      cy={layer.height / 2}
      rx={layer.width / 2}
      ry={layer.height / 2}
      fill={layer.color ? colorToCss(layer.color) : "#000"}
      stroke={selectionColor || "transparent"}
      strokeWidth={1}
    />
  );
};