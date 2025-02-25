import React from "react";
import { useNavigate } from "react-router-dom";

interface NavigateButtonProps {
  to: string;
  className?: string;
}

const NavigateButton: React.FC<NavigateButtonProps> = ({
  to,
  className = "",
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => navigate(to)}
        className={`border-none bg-transparent text-center w-12 h-12 flex items-center justify-center ${className}`}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          height="25px"
          width="25px"
        >
          <path
            d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
            fill="#ffffff"
          />
          <path
            d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
            fill="#ffffff"
          />
        </svg>
      </button>
    </div>
  );
};

export default NavigateButton;
