"use client";

import { useState } from "react";

interface ArrayInputProps {
  onArraySubmit: (array: number[]) => void;
}

const ArrayInput = ({ onArraySubmit }: ArrayInputProps) => {
  const [inputString, setInputString] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    try {
      const inputArray = inputString
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "")
        .map((item) => {
          const num = Number(item);
          if (isNaN(num)) {
            throw new Error(`"${item}" is not a valid number`);
          }
          return num;
        });

      if (inputArray.length === 0) {
        setError("Please enter at least one number");
        return;
      }

      const sortedArray = [...inputArray].sort((a, b) => a - b);

      onArraySubmit(sortedArray);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Invalid input");
    }
  };

  return (
    <div className="mb-6 w-full max-w-md">
      <h2 className="text-lg font-semibold mb-2 text-black">
        Enter Your Array
      </h2>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center">
          <input
            type="text"
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            className="border px-2 py-1 flex-grow text-black"
            placeholder="Enter numbers separated by commas (e.g., 3, 7, 1, 9, 4)"
          />
          <button
            className="bg-[#A87B9F] hover:bg-[#875f7f] text-white px-4 py-1 ml-2 rounded"
            onClick={handleSubmit}
          >
            Create Array
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <p className="text-sm text-gray-600">
          Numbers will be automatically sorted for binary search
        </p>
      </div>
    </div>
  );
};

export default ArrayInput;
