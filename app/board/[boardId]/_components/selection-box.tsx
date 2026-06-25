"use client";

import { useSelectionBounds } from "@/hooks/useSelectionBounds";
import { HANDLE_WIDTH } from "@/lib/consts";
import { LayerType, Side, XYHW } from "@/types/canvas";
import { useSelf, useStorage } from "@liveblocks/react/suspense";
import { memo } from "react";

interface SelectionBoxProps {
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYHW) => void;
}

export const SelectionBox = memo(
  ({ onResizeHandlePointerDown }: SelectionBoxProps) => {
    const soleLayerId = useSelf((me) =>
      me.presence.selection.length === 1 ? me.presence.selection[0] : null
    );
    const isShowingHandles = useStorage(
      (root) =>
        soleLayerId && root.layers?.[soleLayerId]?.type !== LayerType.Path
    );
    const bounds = useSelectionBounds();
    if (!bounds) return null;
    return (
      <>
        <rect
          className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
          style={{ transform: `translate(${bounds.x}px, ${bounds.y}px)` }}
          x={0}
          y={0}
          width={bounds.width}
          height={bounds.height}
        />

        {isShowingHandles && (
          <>
            <rect
              className="fill-white stroke-1 stroke-blue-100"
              x={0}
              y={0}
              style={{
                cursor: "nwse-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${
                  bounds.y - HANDLE_WIDTH / 2
                }px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                // TODO: Add Resize handler
              }}
            />

            <rect
              className="fill-white stroke-1 stroke-blue-100"
              x={0}
              y={0}
              style={{
                cursor: "nwse-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${
                  bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2
                }px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                // TODO: Add Resize handler
              }}
            />
          </>
        )}
      </>
    );
  }
);

SelectionBox.displayName = "SelectionBox";
