"use client";

import React from "react";
import { ClerkProvider, RedirectToSignIn, useAuth } from "@clerk/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient, Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import Loading from "@/components/auth/Loading";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const ConvexClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Unauthenticated>
            <RedirectToSignIn />
        </Unauthenticated>
        <AuthLoading>
          <Loading />
        </AuthLoading>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
