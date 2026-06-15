"use client";

import Image from "next/image";
import Link from "next/link";
import { Overlay } from "./overlay";

interface BoardCardProps {
  key: string;
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
  key,
  id,
  title,
  imageUrl,
  authorId,
  authorName,
  orgId,
  isFavourite,
}: BoardCardProps) => {
  return (
    <Link href={`/board/${id}`}>
      <div className="group aspect-100/127 border rounded-lg flex flex-col justify-between overflow-hidden">
        <div className="relative flex-1 bg-amber-50">
          <Image src={imageUrl} alt="Board Image" fill className="object-fill" />
          <Overlay />
        </div>
      </div>
    </Link>
  );
};

export default BoardCard;
