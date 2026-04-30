"use client";
import { Drawer } from "vaul";
import { cn } from "@/lib/cn";

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({ open, onClose, children, className }: Props) {
  return (
    <Drawer.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50" />
        <Drawer.Content
          className={cn(
            "fixed bottom-0 left-0 right-0 bg-paper rounded-t-3xl z-50",
            "max-h-[90vh] overflow-y-auto shadow-3 outline-none",
            className,
          )}
        >
          <div className="w-10 h-1 bg-line rounded-full mx-auto mt-3 mb-1" />
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
