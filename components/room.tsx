"use client";

import { Layer } from "@/types/canvas";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";

type RoomProps = {
  children: React.ReactNode;
  roomId: string;
  fallback: React.ReactNode;
};

export const Room = ({ children, roomId, fallback }: RoomProps) => (
  <RoomProvider
    id={roomId}
    initialPresence={{ cursor: null, selection: [] }}
    initialStorage={{
      layers: new LiveMap<string, LiveObject<Layer>>(),
      layerIds: new LiveList([]),
    }}
  >
    <ClientSideSuspense fallback={fallback}>
      {() => children}
    </ClientSideSuspense>
  </RoomProvider>
);
