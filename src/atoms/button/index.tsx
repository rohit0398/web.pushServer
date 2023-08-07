import type { ReactNode } from 'react';

type IButtonVarient = 'filled' | 'transparent' | 'out-lined';

type IProps = {
  title: string | ReactNode;
  disabled?: boolean;
  size?: string;
  paddingMargin?: string;
  variant?: IButtonVarient;
  fontSize?: string;
  className?: string;
  onClick?: () => void;
  rounded?: string;
  type?: any;
};
export function Button({
  title,
  disabled = false,
  size = 'h-10',
  paddingMargin = 'px-5 lg:px-8',
  variant = 'filled',
  fontSize = 'text-sm lg:text-base lg:font-bold',
  className = '',
  onClick,
  rounded = 'rounded lg:rounded-lg',
  type = 'button',
}: IProps) {
  function buttonVarient(uiVarient: IButtonVarient) {
    switch (uiVarient) {
      case 'filled':
        return ` bg-dark-purple text-white text-center ${rounded} ${className} ${size} ${paddingMargin} ${fontSize} ${
          disabled ? 'opacity-40 cursor-not-allowed' : ''
        }`;
      case 'transparent':
        return `bg-transparent text-dark-purple text-center ${rounded} ${className} ${size} ${paddingMargin} ${fontSize} ${
          disabled ? 'opacity-40 cursor-not-allowed' : ''
        }`;
      case 'out-lined':
        return `bg-transparent text-dark-purple text-center ${rounded} border border-dark-purple ${className} ${size} ${paddingMargin} ${fontSize} ${
          disabled ? 'opacity-40 cursor-not-allowed' : ''
        }`;
      default:
        return ` bg-dark-purple text-white text-center ${rounded} ${className} ${size} ${paddingMargin} ${fontSize} ${
          disabled ? 'opacity-40 cursor-not-allowed' : ''
        }`;
    }
  }
  return (
    <button
      onClick={onClick}
      className={buttonVarient(variant)}
      disabled={disabled}
      type={type}
    >
      {title}
    </button>
  );
}
