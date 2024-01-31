import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function MaxWidthWrapper({
  className,
  children,
  id,
}: {
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        "mx-auto w-full max-w-screen-xl px-2.5 lg:px-20",
        className,
      )}
    >
      {children}
    </div>
  );
}
