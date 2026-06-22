"use client";

import Image from "next/image";
import Link from "next/link";
import { Overlay } from "./overlay";
import { useAuth } from "@clerk/react";
import { formatDistanceToNow } from "date-fns";
import Footer from "./footer";
import { Actions } from "@/components/actions";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useApiMutation } from "@/app/hooks/useApiMutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

interface BoardCardProps {
  id: string;
  title: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  createdAt: number;
  orgId: string;
  isFavourite: boolean;
}

const BoardCard = ({
  id,
  title,
  imageUrl,
  authorId,
  createdAt,
  authorName,
  orgId,
  isFavourite,
}: BoardCardProps) => {
  const { userId } = useAuth();
  if (!userId) throw new Error("User not authorized");
  const authorLabel = userId === authorId ? "You" : authorName;
  const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true });

  const { mutate: onFavourite, pending: pendingFavourite } = useApiMutation(
    api.board.favourite
  );
  const { mutate: onUnfavourite, pending: pendingUnfavourite } = useApiMutation(
    api.board.unfavourite
  );

  const toggleFavourite = () => {
    if (isFavourite)
      onUnfavourite({ id: id as Id<"boards">, userId }).catch((_) =>
        toast.error("Failed to unfavourite")
      );
    else
      onFavourite({ id: id as Id<"boards">, orgId, userId }).catch((_) =>
        toast.error("Failed to favourite")
      );
  };
  return (
    <Link href={`/board/${id}`}>
      <div className="group aspect-100/127 border rounded-lg flex flex-col justify-between overflow-hidden">
        <div className="relative flex-1 bg-amber-50">
          <Image
            src={imageUrl}
            alt="Board Image"
            fill
            className="object-fill"
          />
          <Overlay />
          <Actions id={id} title={title} side={"right"}>
            <Button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none bg-transparent hover:bg-transparent">
              <MoreHorizontal className="text-black opacity-75 hover:opacity-100 transition-opacity" />
            </Button>
          </Actions>
        </div>

        <Footer
          isFavourite={isFavourite}
          title={title}
          authorLabel={authorLabel}
          createdAtLabel={createdAtLabel}
          onClick={toggleFavourite}
          disabled={pendingFavourite || pendingUnfavourite}
        />
      </div>
    </Link>
  );
};

export default BoardCard;
