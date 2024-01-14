import styles from "@/styles/background.module.scss";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login | Vtae",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className={styles.main}>
        <div className={styles.content}></div>
      </div>

      <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
