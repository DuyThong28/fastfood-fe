import React from "react";
import { Radio } from "@headlessui/react";

type Prototype = {
  size: {
    name: string;
    inStock: boolean;
  };
};

export const ProductVariation: React.FC<Prototype> = ({ size }) => {
  return (
    <Radio
      key={size.name}
      value={size}
      disabled={!size.inStock}
      className={(size.inStock
        ? "cursor-pointer bg-white text-gray-900 shadow-sm"
        : "cursor-not-allowed bg-gray-50 text-gray-200"
      ).concat(
        " group relative flex items-center justify-center rounded-sm border p-2 text-sm  uppercase hover:bg-gray-50 focus:outline-none data-[focus]:ring-2 data-[focus]:black ",
      )}
    >
      <span>{size.name}</span>
      {size.inStock ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-md border border-transparent group-data-[focus]:border group-data-[checked]:border-black"
        />
      ) : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-md border-1 border-gray-200"
        >
          <svg
            stroke="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
          >
            <line
              x1={0}
              x2={100}
              y1={100}
              y2={0}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </span>
      )}
    </Radio>
  );
};
