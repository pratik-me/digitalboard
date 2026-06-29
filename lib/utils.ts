import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { COLORS } from "./consts"
import { Camera, Color, Layer, Point, Side, XYHW } from "@/types/canvas"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const connectionIdColor = (connectionId: number) => {
  return COLORS[connectionId % COLORS.length];
}

export const pointerEventToCanvasPoint = (e: React.PointerEvent, camera: Camera) => {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  }
}

export const colorToCss = (color: Color) => {   // Color to Hexdecimal
  return `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`
}

export const resizeBounds = (bounds: XYHW, corner: Side, point: Point) => {
  const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  }

  if((corner & Side.Left) === Side.Left) {
    result.x = Math.min(point.x, bounds.x + bounds.width);
    result.width = Math.abs(bounds.x + bounds.width - point.x)
  }
  if((corner & Side.Right) === Side.Right) {
    result.x = Math.min(point.x, bounds.x);
    result.width = Math.abs(point.x - bounds.x)
  }
  if((corner & Side.Top) === Side.Top) {
    result.y = Math.min(point.y, bounds.y + bounds.height);
    result.height = Math.abs(bounds.y + bounds.height - point.y);
  }
  if((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(point.y, bounds.y);
    result.height = Math.abs(point.y - bounds.y)
  }

  return result;
}

export const findIntersectingLayerswithRectangle = (layerIds: readonly string[], layers: Record<string, Layer>, a: Point, b: Point) => {
  const rect = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  }

  const ids = [];

  for(const layerId of layerIds) {
    const layer = layers[layerId];
    if(layer == null) continue;

    const {x, y, height, width} = layer;
    if(
      rect.x + rect.height > x &&
      rect.x < x + width &&
      rect.y + rect.height > y &&
      rect.y < y + height
    ) ids.push(layerId);          // Choose only the layers that are inside selecting rectangle
  }

  return ids;
}