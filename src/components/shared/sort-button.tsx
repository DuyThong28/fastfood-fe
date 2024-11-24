import { ChevronDown, ChevronUp } from "lucide-react";

interface SortButtonProps {
  order: string;
  checked: boolean;
  text: string;
  onClick: (newOrder: string) => void;
}

export const SortButton: React.FC<SortButtonProps> = ({
  text,
  order,
  checked,
  onClick,
}) => {
  return (
    <div className="flex flex-row items-center">
      <span>{text}</span>
      <button className="flex flex-col p-1">
        <ChevronUp
          strokeWidth={5}
          size={10}
          className={
            checked && order === "asc"
              ? "text-[#148dff] hover:text-[#5bb0ff]"
              : "text-[#939393] hover:text-[#c1c1c1]"
          }
          onClick={() => onClick("asc")}
        />
        <ChevronDown
          strokeWidth={5}
          size={10}
          className={
            checked && order === "desc"
              ? "text-[#148dff] hover:text-[#5bb0ff]"
              : "text-[#939393] hover:text-[#c1c1c1]"
          }
          onClick={() => onClick("desc")}
        />
      </button>
    </div>
  );
};
