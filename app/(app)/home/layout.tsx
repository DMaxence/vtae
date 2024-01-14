import { ReactNode, Suspense } from "react";
import Profile from "@/components/profile";
import Nav from "@/components/nav";
import Header from "@/components/home/header";
import styles from "@/styles/background.module.scss";
import { Footer } from "@/components/home/footer";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className={styles.main}>
        <div className={styles.content}></div>
      </div>
      <Header />
      {/* TODO : remove bg-black maybe */}
      {/* <div className="mx-auto mb-8 mt-16 w-full max-w-screen-xl px-2.5 text-center lg:px-20"> */}
      {children}
      {/* </div> */}
      <Footer />
    </div>
  );
}
