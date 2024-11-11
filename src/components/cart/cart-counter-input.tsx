import { useEffect, useRef, useState } from "react";

interface CounterInputProps {
  max: number;
  value: number;
  onChange: (value: number) => Promise<void>;
}

export const CartCounterInput: React.FC<CounterInputProps> = ({
  max,
  value,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState<number>(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const eValue = Number(e.target.value);
    if (!isNaN(eValue) && eValue >= 0) {
      setInputValue(eValue);
    }
  };

  const handleIncrease = async () => {
    if (inputValue < max) {
      await onChange(inputValue + 1);
    }
  };

  const handleDerease = async () => {
    if (inputValue > 0) {
      await onChange(inputValue - 1);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await onChange(inputValue);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const handleBlur = async () => {
    await onChange(inputValue);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="max-w-xs flex flex-row items-center gap-4 w-fit">
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={handleDerease}
          id="decrement-button"
          data-input-counter-decrement="quantity-input"
          className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s p-2 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
        >
          <svg
            className="w-2 h-2 text-gray-900 dark:text-white"
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
          ref={inputRef}
          id="quantity-input"
          data-input-counter
          aria-describedby="helper-text-explanation"
          className="bg-gray-50 border-y border-gray-300 p-[2px] text-center text-gray-900 text-sm w-9"
          value={inputValue}
          onChange={handleChangeInput}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          required
        />
        <button
          type="button"
          id="increment-button"
          onClick={handleIncrease}
          data-input-counter-increment="quantity-input"
          className="bg-gray-100  hover:bg-gray-200 border border-gray-300 rounded-e p-2 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
        >
          <svg
            className="w-2 h-2 text-gray-900 dark:text-white"
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
    </div>
  );
};
