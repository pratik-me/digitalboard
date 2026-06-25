"use client";

import Info from "./info";
import Participants from "./participants";
import Toolbar from "./toolbar";
import React, { useCallback, useMemo, useState } from "react";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  Layer,
  LayerType,
  PathLayer,
  Point,
} from "@/types/canvas";
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useOthersMapped,
  useStorage,
} from "@liveblocks/react/suspense";
import CursorsPresence from "./cursors-presence";
import { connectionIdColor, pointerEventToCanvasPoint } from "@/lib/utils";
import { MAX_LAYERS } from "@/lib/consts";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";

const Canvas = ({ boardId }: { boardId: string }) => {
  const layerIds = useStorage((root) => root.layerIds);
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType: Exclude<LayerType, LayerType.Path>,
      position: Point
    ) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size >= MAX_LAYERS) return;
      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();
      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        color: lastUsedColor,
      });

      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.None });
    },
    [lastUsedColor]
  );

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();
      const current = pointerEventToCanvasPoint(e, camera);
      setMyPresence({ cursor: current });
    },
    []
  );

  const onPointerLeave = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      setMyPresence({ cursor: null });
    },
    []
  );

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera);
      if (canvasState.mode === CanvasMode.Inserting)
        insertLayer(canvasState.layerType, point);
      else setCanvasState({ mode: CanvasMode.None });
      history.resume();
    },
    [camera, canvasState, history, insertLayer]
  );

  const selections = useOthersMapped(other => other.presence.selection);
  
  const onLayerPointerDown = useMutation(({self, setMyPresence}, e: React.PointerEvent, layerId: string) => {
    if(canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting) return;
    
    history.pause();
    e.stopPropagation();

    const point = pointerEventToCanvasPoint(e, camera);
    if(!self.presence.selection.includes(layerId)) 
      setMyPresence({selection: [layerId]}, {addToHistory: true});
    setCanvasState({mode: CanvasMode.Translating, current: point});
  }, [setCanvasState, camera, history, canvasState.mode])
  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for(const user of selections) {
      const [connectionId, selection] = user;

      for(const layerId of selection)
        layerIdsToColorSelection[layerId] = connectionIdColor(connectionId);
    }

    return layerIdsToColorSelection;
  }, [selections])

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({ x: camera.x - e.deltaX, y: camera.y - e.deltaY }));
  }, []);

  return (
    <main className="h-screen w-full relative bg-neutral-100 touch-none">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
      />

      <svg
        className="h-screen w-screen"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
      >
        <g style={{ transform: `translate(${camera.x}px, ${camera.y}px)` }}>
          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}
          <CursorsPresence />
        </g>
      </svg>
    </main>
  );
};

export default Canvas;
