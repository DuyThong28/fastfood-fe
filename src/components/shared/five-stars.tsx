import { StarIcon } from "@heroicons/react/20/solid";

interface FiveStarsProps {
  value: number;
}
export const FiveStars: React.FC<FiveStarsProps> = ({ value }) => {
  return (
    <div className="flex">
      {[0, 1, 2, 3, 4].map((rating) => {
        return (
          <StarIcon
            key={rating}
            aria-hidden="true"
            className={(value > rating
              ? "text-gray-900"
              : "text-gray-200"
            ).concat(" h-4 w-4 flex-shrink-0")}
          />
        );
      })}
    </div>
  );
};
