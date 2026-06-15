import Image from "next/image";
import React from "react";

const EmptySearch = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src={"./search.svg"} alt="Search" height={400} width={400} />
      <h2 className="text-3xl font-semibold">No result found!</h2>
      <p className="text-muted-foreground text-lg mt-2">
        Try something for something else
      </p>
    </div>
  );
};

export default EmptySearch;
