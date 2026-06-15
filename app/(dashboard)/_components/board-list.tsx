"use client";

import EmptyBoards from "./empty/empty-boards";
import EmptyFavourites from "./empty/empty-favourites";
import EmptySearch from "./empty/empty-search";


interface BoardListProps {
  orgId: string;
  query: any;
}

const BoardList = ({ orgId, query }: BoardListProps) => {
  const data = [];
  if (!data.length && query.search) return <EmptySearch />
  if (!data.length && query.favourites) return <EmptyFavourites />

  if (!data.length) return <EmptyBoards />
  return <div>{JSON.stringify(query)}</div>;
};

export default BoardList;
