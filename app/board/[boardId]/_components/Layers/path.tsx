import { getSvgPathFromStroke } from "@/lib/utils";
import getStroke from "perfect-freehand";

interface PathProps {
  points: number[][];
  onPointerDown: (e: React.PointerEvent) => void;
  stroke?: string;
  x: number;
  y: number;
  color: string;
}

export const Path = ({
  x,
  y,
  color,
  points,
  onPointerDown,
  stroke,
}: PathProps) => {
  return (
    <path
      className="drop-shadow-md"
      onPointerDown={onPointerDown}
      d={getSvgPathFromStroke(
        getStroke(points, {
          size: 16,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        })
      )}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      x={0}
      y={0}
      fill={color}
      stroke={stroke}
      strokeWidth={1}
    />
  );
};
