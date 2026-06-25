"use client";

import { LayerType } from "@/types/canvas";
import { useStorage } from "@liveblocks/react/suspense";
import { memo } from "react";
import { Rectangle } from "./Layers/Rectangle";

interface LayerPreviewProps {
  id: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export const LayerPreview = memo(
  ({ id, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers?.[id]);

    if (!layer) return null;
    switch (layer.type) {
      case LayerType.Rectangle:
        return (
          <Rectangle id={id} layer={layer} onPointerDown={onLayerPointerDown} />
        );

      default:
        console.warn("Unknown layer type");
        return null;
    }
  }
);

LayerPreview.displayName = "LayerPreview";
