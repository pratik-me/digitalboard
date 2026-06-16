import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";  

interface FooterProps {
  isFavourite: boolean;
  title: string;
  authorLabel: string;
  createdAtLabel: string;
  onClick: () => void;
  disabled: boolean;
}

const Footer = ({
  isFavourite,
  title,
  authorLabel,
  createdAtLabel,
  onClick,
  disabled,
}: FooterProps) => {
  return (
    <div className="relative bg-white p-3">
      <p className="text-[13px] truncate max-w-[calc(100%-24px)] ">{title}</p>
      <p className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground truncate">
        {authorLabel}, {createdAtLabel}
      </p>
      <Button
        disabled={disabled}
        onClick={onClick}
        variant={"ghost"}
        className={cn(
          "absolute top-3 right-3 text-muted-foreground hover:text-blue-600 transition",
          "hover:bg-transparent!",
          "opacity-0 group-hover:opacity-100",
          disabled && "cursor-not-allowed opacity-75"
        )}
      >
        <Star className={cn('size-4', isFavourite && "fill-blue-600 text-blue-600")}/>
      </Button>
    </div>
  );
};

export default Footer;
