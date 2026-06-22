"use client";

import Canvas from "./_components/canvas";
import { Room } from "@/components/room";
import Loading from "./_components/loading";
import { LiveblocksProvider } from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";

const BoardsPage = () => {
  const props = useParams() as {boardId: string,};
  return (
    <LiveblocksProvider authEndpoint={"/api/liveblocks-auth"}>
      <Room roomId={props.boardId} fallback={<Loading />}>
        <Canvas boardId={props.boardId} />
      </Room>
    </LiveblocksProvider>
  );
};

export default BoardsPage;
