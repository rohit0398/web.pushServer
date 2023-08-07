import { forwardRef, ReactNode } from "react";
import Link from "next/link";

const AnchorTag = forwardRef(
  (
    {
      onClick,
      href,
      text = "",
      className = "text-white text-base font-semibold underline text-center",
      children,
    }: {
      onClick?: any;
      href?: any;
      text?: string;
      className?: string;
      children?: ReactNode;
    },
    ref: any
  ) => {
    return (
      <a className={className} href={href} onClick={onClick} ref={ref}>
        {children && children}
        {text}
      </a>
    );
  }
);

export function CustomLink({
  href,
  text,
  className,
  children,
}: {
  href: string;
  text?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Link href={href} passHref legacyBehavior>
      <AnchorTag text={text} className={className} children={children} />
    </Link>
  );
}

export default CustomLink;
