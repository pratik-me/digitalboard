"use client";
import { RenameModal } from "@/components/modals/rename-modal";
import { useEffect, useState } from "react"

/*
-> Hydration Error occurs because the Next.js server pre-renders HTML using the store's initial state, while the browser client tries to initialize or update the store using data from client-only storage like localStorage via the persist middleware. This mismatch in the rendered HTML between the server and client throws a React hydration error. 
* To solve this issue we can following methods:
1) Creating reusable custom hook
2) Using next/dynamic's dynamic method: 
-> const RenameModal = dynamic(() => import('@/components/modals/rename-modal'), { ssr: false, });   // Now use <RenameModal /> 
3) Using useEffect() (best if there's only one or two modals to render):     //! useEffect only runs on client side environment
*/

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if(!isMounted) return null;

    return (
        <>
            <RenameModal />
        </>
    )
}