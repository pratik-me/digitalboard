"use client";

import { Actions } from "@/components/actions";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useRenameModal } from "@/store/use-rename-modal";
import { useQuery } from "convex/react";
import { Menu } from "lucide-react";
import { Chelsea_Market } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const chelseaMarket = Chelsea_Market({
  subsets: ["latin"],
  weight: ["400"],
});

const Info = ({ boardId }: { boardId: string }) => {
  const { onOpen } = useRenameModal();
  const data = useQuery(api.board.get, { id: boardId as Id<"boards"> });
  if (!data) return <InfoSkeleton />;
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
      <Hint label="Go to boards" side="bottom" sideOffset={15}>
        <Button variant={"board"} className="px-2" asChild>
          <Link href={"/"}>
            <div className="flex items-center justify-center">
              <Image
                src={"/aleph-purple.png"}
                alt="Logo"
                height={60}
                width={60}
                className="size-7"
              />
              <span
                className={cn(
                  "font-semibold text-2xl text-blue-800",
                  chelseaMarket.className
                )}
              >
                Board
              </span>
            </div>
          </Link>
        </Button>
      </Hint>
      <div className="text-neutral-300 px-1.5" />
      <Hint label="Edit title" side="bottom" sideOffset={15}>
        <Button
          variant={"board"}
          className="text-base font-normal px-2"
          onClick={() => onOpen(data._id, data.title)}
        >
          {data.title}
        </Button>
      </Hint>
      <div className="text-neutral-300 px-1.5" />
      <Actions id={data._id} title={data.title} side="bottom" sideOffset={15}>
        <div>
          <Hint label="Main Menu" side="bottom" sideOffset={15}>
            <Button size={"icon"} variant={"board"}>
              <Menu />
            </Button>
          </Hint>
        </div>
      </Actions>
    </div>
  );
};

export default Info;

export const InfoSkeleton = () => {
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-75" />
  );
};
