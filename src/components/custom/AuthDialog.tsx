"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ isOpen, onOpenChange }: AuthDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Continue with Nitro
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm">
            Sign in or create an account to continue building with Nitro
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Link href="/sign-in" className="w-full">
            <Button
              variant="outline"
              className="w-full bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800 hover:text-white text-zinc-300"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up" className="w-full">
            <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white">
              Create Account
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
