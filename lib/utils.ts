import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { COLORS } from "./consts"
import { Camera } from "@/types/canvas"

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