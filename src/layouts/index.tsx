import type { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

import { Header } from '@/molecules';

type IProps = {
  children: ReactNode;
  showFooter?: boolean;
};
export function Layout({ children }: IProps) {
  return (
    <div className=" flex h-screen w-screen flex-col sm:flex-row">
      <Header />
      {children}
      <ToastContainer />
    </div>
  );
}
