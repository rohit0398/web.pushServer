import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

import { Footer, Header } from "@/molecules";

type IProps = {
  children: ReactNode;
  showFooter?: boolean;
};
export function Layout({ children }: IProps) {
  return (
    <div className=" flex w-screen h-screen flex-col sm:flex-row">
      <Header />
      {children}
      <ToastContainer />
    </div>
  );
}
