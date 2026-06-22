import { query } from "./_generated/server";
import { v } from "convex/values"
import { favourite } from "./board";

export const get = query({
    args: {
        orgId: v.string(),
        search: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");
        const boards = await ctx.db.query("boards").withIndex("by_org", q => q.eq("orgId", args.orgId)).order("desc").collect();
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