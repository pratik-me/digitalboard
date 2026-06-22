import { useMutation } from "convex/react";
import { FunctionArgs, FunctionReference, FunctionReturnType } from "convex/server";
import { useState } from "react"

export const useApiMutation = <T extends FunctionReference<"mutation">>(
    mutationFunction: T
) => {
    const [pending, setPending] = useState<boolean>(false);
    const apiMutation = useMutation(mutationFunction);

    const mutate = (payload: FunctionArgs<T>): Promise<FunctionReturnType<T>> => {
        setPending(true);
        return apiMutation(payload)
            .finally(() => setPending(false));
    };

    return {
        mutate,
        pending,
    };
};