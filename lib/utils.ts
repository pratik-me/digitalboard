import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { COLORS } from "./consts"
import { Camera, Color } from "@/types/canvas"

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