import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    // Grab the most recent messages.
    const messages = await ctx.db.query("messages").order("desc").take(100);
    // Reverse the list so that it's in a chronological order.
    const messagesWithLikes = await Promise.all(
      messages.map(async (message) => {
        const likes = await ctx.db.query("likes").withIndex("byMessageID", (q) => q.eq("messageID", message._id)).collect();
        return {
          ...message,
          likes: likes.length};
      })
    )

    return messagesWithLikes.reverse().map( 
      (message) => ({
      ...message,
      body: message.body.replaceAll(":)", "🤗"),
    })
  );
  },
});

export const send = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async (ctx, { body, author }) => {
    // Send a new message.
    await ctx.db.insert("messages", { body, author });
  },
});

export const like = mutation({
  args: {liker: v.string(), messageID: v.string()},
  handler: async (ctx, args) => {
    await ctx.db.insert("likes", {liker: args.liker, messageID: args.messageID});
  }
})