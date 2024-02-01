import { Site, User } from "@prisma/client";
import styles from "./gamedev.module.scss";
import { cn } from "@/lib/utils";

type HeroProps = {
  site: Site & {
    user: User;
  };
};

export default function Hero({ site }: HeroProps) {
  return (
    <div className={cn("flex h-screen", styles.heroContainer)}>
      <div className="flex h-full w-2/3 flex-col items-center justify-center bg-gradient-to-r from-[rgba(114,112,222,0.1)] to-[rgba(114,112,222,0.4)] to-[97%] text-white backdrop-blur">
        <div className="text-justify drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
          <h1 className="text-7xl font-bold leading-[88px] tracking-normal">
            {site.name}
          </h1>
          <p className="text-2xl">{site.description}</p>
        </div>
      </div>
    </div>
  );
}
