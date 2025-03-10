interface SvgProps {
  className?: string;
  color?: string;
}

const CloseIcon: React.FC<SvgProps> = ({ className = "h-5 w-5", color = "#000" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke={color}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default CloseIcon;