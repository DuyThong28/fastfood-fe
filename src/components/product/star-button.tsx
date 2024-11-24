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
          ? "px-4 py-2 border border-black bg-white text-black"
          : "px-4 py-2 border border-muted/50 text-black bg-white"
      }
      onClick={onClick}
    >
      {value}
    </button>
  );
};
