import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    // Check for existing user
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    console.log("CreateUser - Existing User:", existingUser);

    if (existingUser) {
      console.log("CreateUser - User already exists");
      return { status: "exists", user: existingUser };
    }

    // Create new user
    const newUser = await ctx.db.insert("users", {
      name: args.name,
      picture: args.picture,
      email: args.email,
      uid: args.uid,
    });

    console.log("CreateUser - New User Created:", newUser);
    return { status: "created", user: newUser };
  },
});

export const GetUser = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    return user[0];
  },
});
