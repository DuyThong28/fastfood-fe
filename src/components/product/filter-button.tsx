interface FilterButtonProps {
    value: string;
    onClick: () => void;
    isActive: boolean;
  }
  
  export const FilterButton: React.FC<FilterButtonProps> = ({
    value,
    onClick,
    isActive,
  }) => {
    return (
      <button
        className={
          isActive
            ? "px-4 py-2 border border-black bg-black text-white"
            : "px-4 py-2 border border-muted/50 text-black bg-white hover:bg-slate-50"
        }
        onClick={onClick}
      >
        {value}
      </button>
    );
  };
  