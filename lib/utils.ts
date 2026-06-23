import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { COLORS } from "./consts"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const connectionIdColor = (connectionId: number) => {
  return COLORS[connectionId % COLORS.length];
}