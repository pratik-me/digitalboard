"use client";

import { useApiMutation } from "@/hooks/useApiMutation";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const EmptyBoards = () => {
  const router = useRouter();
  const { mutate, pending } = useApiMutation(api.board.create);
  const { organization } = useOrganization();
  const { user } = useUser();

  const handleClick = () => {
    if (!organization) throw new Error("No organization found!");
    mutate({
      orgId: organization.id,
      title: "Untitled",
      name: user?.fullName || "Unknown User",
    }).then(id => {
      toast.success("Board created");
      router.push(`/board/${id}`);
    }).catch(_ => toast.error("Failed to create the board"));
  };
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src={"./folder.svg"}
        alt="Empty Boards"
        height={250}
        width={250}
        loading="lazy"
      />
      <h2 className="text-3xl font-semibold mt-4">Create your first board!</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Start by creating a board for your organization
      </p>
      <div className="mt-4">
        <Button size={"lg"} onClick={handleClick} disabled={pending}>
          Create Board
        </Button>
      </div>
    </div>
  );
};

export default EmptyBoards;
