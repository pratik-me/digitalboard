import Info from "./info";
import Participants from "./participants";
import Toolbar from "./toolbar";
import { DotPulse } from "ldrs/react";
import "ldrs/react/DotPulse.css";

const Loading = () => {
  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none flex items-center justify-center">
      <DotPulse size="43" speed="1.3" color="black" />
      <Info.Skeleton />
      <Participants.Skeleton />
      <Toolbar.Skeleton />
    </main>
  );
};

export default Loading;
