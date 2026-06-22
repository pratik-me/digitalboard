"use client";

import { useApiMutation } from "@/app/hooks/useApiMutation";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreateBoardButtonProps {
  orgId: string;
  disabled?: boolean;
}

const CreateBoardButton = ({ orgId, disabled }: CreateBoardButtonProps) => {
  const router = useRouter();
  const {user} = useUser();
  if(!user) throw new Error("Not authorized!");
  const {mutate, pending} = useApiMutation(api.board.create);

  const handleClick = () => {
    mutate({
      orgId,
      title: "Untitled",
      name: user.fullName || "Anonymous",
    }).then(id => {
      toast.success("Board Created!")
      router.push(`/board/${id}`);
    }).catch(() => toast.error("Failed to create board"))
  }
  return (
    <Button
      className={cn(
        "col-span-1 aspect-100/127 h-full bg-blue-700 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6",
        (disabled || pending) && "opacity-75 hover:bg-blue-600 cursor-not-allowed"
      )}
      onClick={handleClick}
      disabled={pending || disabled}
    >
      <div />
      <Plus className="size-12 text-white stroke-1" />
      <p className="text-xs text-white font-light">New board</p>
    </Button>
  );
};

export default CreateBoardButton;
