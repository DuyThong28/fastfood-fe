interface StarButtonProps {
  value: string;
  onClick: () => void;
  isActive: boolean;
}

export const StarButton: React.FC<StarButtonProps> = ({
  value,
  onClick,
  isActive,
}) => {
  return (
    <button
      className={
        isActive
          ? "px-4 py-2 border border-[#A93F15] bg-white text-[#A93F15] min-w-[80.39px] md:w-fit"
          : "px-4 py-2 border border-muted/50 text-black bg-white min-w-[80.39px] md:w-fit"
      }
      onClick={onClick}
    >
      {value}
    </button>
  );
};
