"use client";

import { useOthersConnectionIds, useSelf } from "@liveblocks/react/suspense";
import { memo } from "react";
import { Cursor } from "./cursor";

const Cursors = () => {
  const user = useSelf();
  const ids = useOthersConnectionIds();
  return (
    <>
      {ids.map((connectionId) => (
        <Cursor key={connectionId} connectionId={connectionId} />
      ))}
    </>
  );
};

const CursorsPresence = memo(() => {
  return (
    <>
      <Cursors />
    </>
  );
});

CursorsPresence.displayName = "CursorsPresence";

export default CursorsPresence;
