import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm w-screen">
      <Ring size="40" stroke="5" speed="2" color="black" />
    </div>
  );
};

export default Loading;
