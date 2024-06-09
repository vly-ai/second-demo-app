import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const res = await ctx.db.query("users").order("desc").take(100);
        return res;
    }
});

export const add = mutation({
    args: {name: v.string(), email: v.string()},
    handler: async (ctx, {name, email}) => {
        await ctx.db.insert("users", {name, email});
    }
})