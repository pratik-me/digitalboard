"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OrganizationSwitcher } from "@clerk/react";
import { LayoutDashboard, Star } from "lucide-react";
import { Chelsea_Market } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const chelseaMarket = Chelsea_Market({
  subsets: ["latin"],
  weight: ["400"],
});

const OrgSidebar = () => {
  const searchParams = useSearchParams();
  const favourites = searchParams.get("favourites");
  return (
    <div className="hidden lg:flex flex-col space-y-6 w-51.5 pl-2 pt-5">
      <Link href={"/"}>
        <div className="flex items-center justify-center">
          <Image
            src={"/aleph-purple.png"}
            alt="Logo"
            height={60}
            width={60}
            className="size-7"
          />
          <span
            className={cn(
              "font-semibold text-2xl text-blue-800",
              chelseaMarket.className
            )}
          >
            Board
          </span>
        </div>
      </Link>
      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            },
            organizationSwitcherTrigger: {
              padding: "6px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              justifyContent: "space-between",
              backgroundColor: "white",
            },
          },
        }}
      />

      <div className="space-y-1 w-full">
        <Button
          asChild
          variant={favourites ? "ghost" : "secondary"}
          size="lg"
          className="font-normal justify-start px-2 w-full"
        >
          <Link href={"/"}>
            <LayoutDashboard className="size-4 mr-2" />
            Team Boards
          </Link>
        </Button>

        <Button
          asChild
          variant={favourites ? "secondary" : "ghost"}
          size="lg"
          className="font-normal justify-start px-2 w-full"
        >
          <Link
            href={{
              pathname: "/",
              query: { favourites: true },
            }}
          >
            <Star className="size-4 mr-2" />
            Favourite Boards
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default OrgSidebar;
