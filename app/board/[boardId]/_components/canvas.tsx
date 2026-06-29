"use client";

import Info from "./info";
import Participants from "./participants";
import Toolbar from "./toolbar";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
  Side,
  XYHW,
} from "@/types/canvas";
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useOthersMapped,
  useSelf,
  useStorage,
} from "@liveblocks/react/suspense";
import CursorsPresence from "./cursors-presence";
import {
  colorToCss,
  connectionIdColor,
  findIntersectingLayerswithRectangle,
  penPointsToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds,
} from "@/lib/utils";
import { MAX_LAYERS } from "@/lib/consts";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "./selection-tools";
import { Path } from "./Layers/path";
import { useDisableScrollBounce } from "@/hooks/use-disable-scroll-bounce";
import { useDeleteLayers } from "@/hooks/use-delete-layers";

const Canvas = ({ boardId }: { boardId: string }) => {
  const layerIds = useStorage((root) => root.layerIds);
  const pencilDraft = useSelf((me) => me.presence.pencilDraft);

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });

  useDisableScrollBounce();
  const deleteLayers = useDeleteLayers();
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

  const unselectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0)
      setMyPresence({ selection: [] }, { addToHistory: true });
  }, []);

  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      setCanvasState({ mode: CanvasMode.SelectionNet, origin, current });
    }
  }, []);

  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get("layers").toJSON();
      setCanvasState({ mode: CanvasMode.SelectionNet, origin, current });

      const ids = findIntersectingLayerswithRectangle(
        layerIds,
        layers,
        origin,
        current
      );
      setMyPresence({ selection: ids });
    },
    []
  );

  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) return;

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point
      );

      const liveLayers = storage.get("layers");
      const layer = liveLayers.get(self.presence.selection[0]);
      if (layer) layer.update(bounds);
    },
    [canvasState]
  );

  const insertPath = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const { pencilDraft } = self.presence;

      if (
        pencilDraft == null ||
        pencilDraft.length < 2 ||
        liveLayers.size >= MAX_LAYERS
      ) {
        setMyPresence({ pencilDraft: null });
        return;
      }

      const id = nanoid();

      liveLayers.set(
        id,
        new LiveObject(penPointsToPathLayer(pencilDraft, lastUsedColor))
      );

      const liveLayerIds = storage.get("layerIds");
      liveLayerIds.push(id);

      setMyPresence({ pencilDraft: null });
      setCanvasState({ mode: CanvasMode.Pencil });
    },
    [lastUsedColor]
  );

  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: lastUsedColor,
      });
    },
    [lastUsedColor]
  );

  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
      const { pencilDraft } = self.presence;

      if (
        canvasState.mode !== CanvasMode.Pencil ||
        e.buttons !== 1 ||
        pencilDraft == null
      )
        return;

      setMyPresence({
        cursor: point,
        pencilDraft:
          pencilDraft.length === 1 &&
          pencilDraft[0][0] == point.x &&
          pencilDraft[0][1] == point.y
            ? pencilDraft
            : [...pencilDraft, [point.x, point.y, e.pressure]],
      });
    },
    []
  );

  const translateSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) return;
      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get("layers");
      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);
        if (layer) {
          layer.update({
            x: layer.get("x") + offset.x,
            y: layer.get("y") + offset.y,
          });
        }
      }
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState]
  );

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();
      const current = pointerEventToCanvasPoint(e, camera);
      if (canvasState.mode === CanvasMode.Pressing)
        startMultiSelection(current, canvasState.origin);
      else if (canvasState.mode === CanvasMode.SelectionNet)
        updateSelectionNet(current, canvasState.origin);
      else if (canvasState.mode === CanvasMode.Translating)
        translateSelectedLayer(current);
      else if (canvasState.mode === CanvasMode.Resizing)
        resizeSelectedLayer(current);
      else if (canvasState.mode === CanvasMode.Pencil)
        continueDrawing(current, e);
      setMyPresence({ cursor: current });
    },
    [
      canvasState,
      resizeSelectedLayer,
      continueDrawing,
      camera,
      updateSelectionNet,
      translateSelectedLayer,
      startMultiSelection,
    ]
  );

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera);
      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unselectLayers();
        setCanvasState({ mode: CanvasMode.None });
      } else if (canvasState.mode === CanvasMode.Inserting)
        insertLayer(canvasState.layerType, point);
      else if (canvasState.mode === CanvasMode.Pencil) insertPath();
      else setCanvasState({ mode: CanvasMode.None });
      history.resume();
    },
    [
      camera,
      canvasState,
      history,
      setCanvasState,
      insertLayer,
      insertPath,
      unselectLayers,
    ]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);
      if (canvasState.mode === CanvasMode.Inserting) return;
      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }
      setCanvasState({ origin: point, mode: CanvasMode.Pressing });
    },
    [camera, canvasState.mode, setCanvasState, startDrawing]
  );

  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      // Triggers when  user click on layer: pause liveblocks history, stop propagation and update storage (using setMyPresence) and canvasState to latest one.
      // Don't do anything when state is Pencil or Inserting
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      )
        return;

      history.pause();
      e.stopPropagation();

      const point = pointerEventToCanvasPoint(e, camera);
      if (!self.presence.selection.includes(layerId))
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [setCanvasState, camera, history, canvasState.mode]
  );

  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYHW) => {
      history.pause();
      setCanvasState({ mode: CanvasMode.Resizing, initialBounds, corner });
    },
    [history]
  );

  const selections = useOthersMapped((other) => other.presence.selection);
  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;

      for (const layerId of selection)
        layerIdsToColorSelection[layerId] = connectionIdColor(connectionId);
    }

    return layerIdsToColorSelection;
  }, [selections]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({ x: camera.x - e.deltaX, y: camera.y - e.deltaY }));
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // TODO: Add listeners for each layerType
      // TODO: Add listener for deleting layers if they are not Note or Text
      switch (e.key) {
        case "z": {
          if(e.ctrlKey || e.metaKey) {
            if(e.shiftKey) history.redo();
            else history.undo();
            break;
          }
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [deleteLayers, history])

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

      <SelectionTools camera={camera} setLastUsedColor={setLastUsedColor} />

      <svg
        className="h-screen w-screen"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
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

          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />

          {canvasState.mode === CanvasMode.SelectionNet &&
            canvasState.current != null && (
              <rect
                className="fill-blue-500/5 stroke-blue-500 stroke-1"
                x={Math.min(canvasState.origin.x, canvasState.current?.x)}
                y={Math.min(canvasState.origin.y, canvasState.current?.y)}
                width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                height={Math.abs(canvasState.origin.y - canvasState.current.y)}
              />
            )}
          <CursorsPresence />
          {pencilDraft != null && pencilDraft.length > 0 && (
            <Path
              points={pencilDraft}
              color={colorToCss(lastUsedColor)}
              x={0}
              y={0}
            />
          )}
        </g>
      </svg>
    </main>
  );
};

export default Canvas;
