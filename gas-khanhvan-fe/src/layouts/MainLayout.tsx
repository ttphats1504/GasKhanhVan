import Navbar from "@/components/common/Navbar";
import { Footer } from "antd/es/layout/layout";
import React, { ReactNode } from "react";
import HeadTag from "@/components/home/HeadTag";

import styles from "../styles/home/Home.module.scss";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className={styles.container}>
      <HeadTag />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
