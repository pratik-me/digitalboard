"use client";

import { useQuery } from "convex/react";
import EmptyBoards from "./empty/empty-boards";
import EmptyFavourites from "./empty/empty-favourites";
import EmptySearch from "./empty/empty-search";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import BoardCard from "./board-card";
import CreateBoardButton from "./create-board-button";

interface BoardListProps {
  orgId: string;
  query: any;
}

const BoardList = ({ orgId, query }: BoardListProps) => {
  const data = useQuery(api.boards.get, { orgId, ...query });
  if (data === null) throw new Error("No board found in database!"); // If there's no data then data === null
  if (data === undefined)                                            // If data is fetching then data === undefined
    return (
      <div>
        <h2 className="text-3xl">
          {query.favourites ? "Favourite Boards" : "Team Boards"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <CreateBoardButton orgId={orgId} disabled={true} />
          {[1, 2, 3, 4, 5].map((index) => (
            <BoardCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  if (!data.length && query.search) return <EmptySearch />;
  if (!data.length && query.favourites) return <EmptyFavourites />;

  if (!data.length) return <EmptyBoards />;
  return (
    <div>
      <h2 className="text-3xl">
        {query.favourites ? "Favourite Boards" : "Team Boards"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        <CreateBoardButton orgId={orgId} />
        {data?.map((board) => (
          <BoardCard
            id={board._id}
            key={board._id}
            title={board.title}
            imageUrl={board.imageUrl}
            authorId={board.authorId}
            authorName={board.authorName}
            createdAt={board._creationTime}
            orgId={board.orgId}
            isFavourite={board.isFavourite}
          />
        ))}
      </div>
    </div>
  );
};

function BoardCardSkeleton() {
  return (
    <div className="aspect-100/127 rounded-lg overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
  );
}

export default BoardList;
