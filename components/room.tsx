"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";

type RoomProps = {
  children: React.ReactNode;
  roomId: string;
  fallback: React.ReactNode;
};

export const Room = ({ children, roomId, fallback }: RoomProps) => (
  <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
    <ClientSideSuspense fallback={fallback}>
      {() => children}
    </ClientSideSuspense>
  </RoomProvider>
);
