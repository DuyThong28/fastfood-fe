import { Dispatch, SetStateAction } from "react";

interface CounterInputProps {
  max: number;
  value: number;
  onChange: Dispatch<SetStateAction<number>>;
}

export const CounterInput: React.FC<CounterInputProps> = ({
  max,
  value,
  onChange,
}) => {
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const eValue = Number(e.target.value);
    if (!isNaN(eValue)) {
      onChange(eValue);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDerease = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };
  return (
    <div className="max-w-xs flex flex-row items-center gap-4">
      <div className="relative flex items-center max-w-[8rem]">
        <button
          type="button"
          onClick={handleDerease}
          id="decrement-button"
          data-input-counter-decrement="quantity-input"
          className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s p-3 h-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
        >
          <svg
            className="w-3 h-3 text-gray-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 2"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h16"
            />
          </svg>
        </button>
        <input
          type="number"
          id="quantity-input"
          data-input-counter
          aria-describedby="helper-text-explanation"
          className="bg-gray-50 border-x-0 border-gray-300 h-8 text-center text-gray-900 text-sm"
          value={value}
          onChange={handleChangeInput}
          min={0}
          max={max}
          required
        />
        <button
          type="button"
          id="increment-button"
          onClick={handleIncrease}
          data-input-counter-increment="quantity-input"
          className="bg-gray-100  hover:bg-gray-200 border border-gray-300 rounded-e p-3 h-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
        >
          <svg
            className="w-3 h-3 text-gray-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
        </button>
      </div>
      <p>{`${max} san pham co san`}</p>
    </div>
  );
};
