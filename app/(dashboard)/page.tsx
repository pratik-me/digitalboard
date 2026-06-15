"use client";

import { useSearchParams } from "next/navigation";
import BoardList from "./_components/board-list";
import { useOrganization } from "@clerk/react";
import EmptyOrg from "./_components/empty/empty-org";

export default function DashboardPage() {
  const { organization } = useOrganization();
  const queryParmas = useSearchParams();
  const query = Object.fromEntries(queryParmas.entries());
  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (
        <EmptyOrg />
      ) : (
        <BoardList orgId={organization.id} query={query} />
      )}
    </div>
  );
}
