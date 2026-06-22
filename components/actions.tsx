"use client";

import { Link2, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/useApiMutation";
import { api } from "@/convex/_generated/api";
import { ConfirmModal } from "./modals/confirm-modal";
import { Button } from "./ui/button";
import { useRenameModal } from "@/store/use-rename-modal";
import { Id } from "@/convex/_generated/dataModel";

interface ActionsProps {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left" | undefined;
  sideOffset?: number | undefined;
  id: string;
  title: string;
}

export const Actions = ({
  children,
  side,
  sideOffset,
  id,
  title,
}: ActionsProps) => {
  const {onOpen} = useRenameModal();
  const { mutate, pending } = useApiMutation(api.board.remove);
  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/board/${id}`)
      .then(() => toast.success("Link copied"))
      .catch(() => toast.error("Failed to copy link"));
  };
  const onDelete = () => {
    mutate({ id: id as Id<"boards"> })
      .then(() => toast.success("Board delete"))
      .catch(() => toast.error("Failed to delete board"));
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        side={side}
        sideOffset={sideOffset}
        className="w-60"
      >
        <DropdownMenuItem className="p-3 cursor-pointer" onClick={onCopyLink}>
          <Link2 className="size-4 mr-2" />
          Copy board link
        </DropdownMenuItem>
        <DropdownMenuItem className="p-3 cursor-pointer" onClick={() => onOpen(id, title)}>
          <Pencil className="size-4 mr-2" />
          Rename
        </DropdownMenuItem>

        {/* TODO: Change Delete Modal from Button to DropdownMenuItem to close the dropdownMenu when any action is performed.  */}
        <ConfirmModal
          header="Delete board?"
          description="This will delete the board and all of its contents."
          disabled={pending}
          onConfirm={onDelete}
        >
          <Button className="p-3 cursor-pointer text-sm w-full justify-start font-normal" variant={"ghost"}>
            <Trash2 className="size-4 mr-2" />
            Delete
          </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
