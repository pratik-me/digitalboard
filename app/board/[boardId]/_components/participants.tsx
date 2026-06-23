import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { UserAvatar } from "./user-avatar";
import { MAX_SHOWN_USERS } from "@/lib/consts";
import { connectionIdColor } from "@/lib/utils";

const Participants = () => {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > MAX_SHOWN_USERS;
  const remainingUsers = users.length - MAX_SHOWN_USERS;

  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-2 flex items-center shadow-md">
      <div className="flex gap-x-2">
        {/* TODO: Use AvatarGroup and AvatarGroupCount instead of div */}
        {currentUser && (
          <UserAvatar
            borderColor={connectionIdColor(currentUser.connectionId)}
            src={currentUser.info?.picture}
            name={`${currentUser.info?.name} (You)`}
            fallback={currentUser.info?.name?.[0]}
          />
        )}

        {users.slice(0, MAX_SHOWN_USERS).map(({ connectionId, info }) => (
          <UserAvatar
            borderColor={connectionIdColor(connectionId)}
            src={info?.picture}
            name={info?.name}
            fallback={info?.name?.[0]}
          />
        ))}

        {hasMoreUsers && (
          <UserAvatar
            name={`${remainingUsers} more`}
            fallback={`+${remainingUsers}`}
          />
        )}
      </div>
    </div>
  );
};

export default Participants;

export const ParticipantsSkeleton = () => {
  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-2 flex items-center shadow-md w-25" />
  );
};
