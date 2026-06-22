import { query } from "./_generated/server";
import { v } from "convex/values"
import { favourite } from "./board";
import { getAllOrThrow } from "@/lib/convex-helper/getAllOrThrow";

export const get = query({
    args: {
        orgId: v.string(),
        search: v.optional(v.string()),
        favourites: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        if (args.favourites) {
            const favouriteBoards = await ctx.db
                .query("userFavourites")
                .withIndex("by_user_org", q => q
                    .eq("userId", identity.subject)
                    .eq("orgId", args.orgId)).order("desc").collect();
            
            const ids = favouriteBoards.map(board => board.boardId);
            const boards = await getAllOrThrow(ctx.db, ids);

            return boards.map(board => ({
                ...board, 
                isFavourite: true,
            }))
        }

        const title = args.search as string;
        let boards: any[] = [];
        if (title) {
            boards = await ctx.db.query("boards").withSearchIndex("search_title", q => q.search("title", title).eq("orgId", args.orgId)).collect();
        } else {
            boards = await ctx.db.query("boards").withIndex("by_org", q => q.eq("orgId", args.orgId)).order("desc").collect();
        }
        
        const boardsWithFavourite = await boards.map(
            board => ctx.db
                .query("userFavourites")
                .withIndex("by_user_board", q => q.eq("userId", identity.subject).eq("boardId", board._id)).unique()
                .then(favourite => ({ ...board, isFavourite: !!favourite }))
        )

        const boardsWithFavouriteRelation = Promise.all(boardsWithFavourite);
        return boardsWithFavouriteRelation;
    }
})