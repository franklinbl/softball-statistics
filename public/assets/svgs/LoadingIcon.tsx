interface SvgProps {
  className?: string;
  color?: string;
}

const LoadingIcon: React.FC<SvgProps> = ({ className = "animate-spin h-5 w-5 mx-auto", color = "#000" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill={color}
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0012 20c4.411 0 8-3.589 8-8h-4a4 4 0 01-4-4v-.291z"></path>
  </svg>
);

export default LoadingIcon;