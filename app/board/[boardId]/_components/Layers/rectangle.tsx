import { colorToCss } from "@/lib/utils";
import { RectangleLayer } from "@/types/canvas";

interface RectangleProps {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Rectangle = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: RectangleProps) => {
  const { x, y, width, height, color } = layer;
  return (
    <rect
      className="drop-shadow-md"
      onPointerDown={(e: React.PointerEvent) => onPointerDown(e, id)}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      x={0}
      y={0}
      rx={15}
      ry={15}
      width={width}
      height={height}
      strokeWidth={1}
      fill={color ? colorToCss(color) : "#000"}
      stroke={selectionColor || "transparent"}
    />
  );
};
