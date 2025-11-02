import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateSession = mutation({
  args: {
    message: v.object({
      role: v.string(),
      content: v.string(),
    }),
    user: v.id("users"),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert("session", {
      message: [args.message], // Changed from messages to message
      user: args.user,
    });
    return sessionId;
  },
});

export const GetSession = query({
  args: {
    sessionId: v.id("session"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    return session;
  },
});

export const UpdateMessages = mutation({
  args: {
    sessionId: v.id("session"),
    message: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.sessionId, {
      message: args.message,
    });
    return result;
  },
});
