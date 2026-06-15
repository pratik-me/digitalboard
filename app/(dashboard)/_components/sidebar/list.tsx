"use client";

import { useOrganizationList } from "@clerk/react";
import { Item } from "./item";

export const List = () => {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  if (!userMemberships.data?.length) return null;

  return (
    <ul className="space-y-4">
      {userMemberships.data.map((membership) => (
        <div key={membership.organization.id}>
          <Item
            key={membership.organization.id}
            name={membership.organization.name}
            id={membership.organization.id}
            imageUrl={membership.organization.imageUrl}
          />
        </div>
      ))}
    </ul>
  );
};
