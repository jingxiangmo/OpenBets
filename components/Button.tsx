import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  isPressed?: boolean;
  className?: string;
  color?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, isPressed = false, className = '', color = 'bg-yellow-300' }) => {
  return (
    <button
      onClick={onClick}
      className={`m-2 p-0 text-lg font-semibold rounded-md border-none bg-gray-700 text-[#1e3050] ${className}`}
      data-pressed={isPressed}
    >
      <span
        className={`block p-2.5 rounded-md border-none ${color} transition-transform ease-linear -translate-y-2 duration-40 transform shadow ${
          isPressed ? 'translate-y-0' : 'hover:-translate-y-3 active:translate-y-0'
        }`}
      >

        {children}
      </span>
    </button>
  );
};

export default Button;