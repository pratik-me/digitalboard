import { Hint } from "@/components/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ANONYMOUS } from "@/lib/consts";

interface UserAvatarProps {
  key?: number
  src?: string;
  name?: string;
  fallback?: string;
  borderColor?: string;
}

export const UserAvatar = ({
  src,
  name,
  fallback,
  borderColor,
}: UserAvatarProps) => {
  return (
    <Hint label={name || ANONYMOUS} side="bottom" sideOffset={15}>
      <Avatar className="size-8 border-2" style={{ borderColor }}>
        <AvatarImage src={src} />
        <AvatarFallback className="text-xs font-semibold">
            {fallback || "A"}
        </AvatarFallback>
      </Avatar>
    </Hint>
  );
};
