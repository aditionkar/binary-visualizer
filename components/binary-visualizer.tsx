"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ArrayInput from "./array-input";

interface Step {
  array: number[];
  currentIndex: number | null;
  startIndex: number;
  endIndex: number;
}

const BinarySearchVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState<number | "">("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [found, setFound] = useState<boolean | null>(null);
  const [searching, setSearching] = useState<boolean>(false);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const elementWidth = 56; 

  useEffect(() => {
    const initialArray: number[] = [];
    setArray(initialArray);
  }, []);

  const handleArraySubmit = (newArray: number[]) => {
    setArray(newArray);
    setSteps([]);
    setFound(null);
    setFoundIndex(null);
    setSearchValue("");
  };

  const binarySearch = async (
    target: number,
    l = 0,
    h = array.length - 1,
    history: Step[] = []
  ) => {
    setSearching(true);
    setFound(null);
    setFoundIndex(null);

    if (l > h) {
      setFound(false);
      setSearching(false);
      return;
    }

    let mid = Math.floor((l + h) / 2);
    const currentStep: Step = {
      array: array.slice(l, h + 1),
      currentIndex: mid - l,
      startIndex: l,
      endIndex: h,
    };

    history.push(currentStep);
    setSteps([...history]);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (array[mid] === target) {
      setFound(true);
      setFoundIndex(mid);
      setSearching(false);
      return;
    } else if (array[mid] < target) {
      binarySearch(target, mid + 1, h, history);
    } else {
      binarySearch(target, l, mid - 1, history);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 text-center  rounded-lg px-6 py-3 shadow-xl bg-white inline-block mb-5">
        Binary Search Visualizer
      </h1>

      <ArrayInput onArraySubmit={handleArraySubmit} />

      {array.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-black text-center">
            Current Sorted Array
          </h2>
          <div className="flex space-x-2 flex-wrap justify-center">
            {array.map((num, idx) => (
              <div
                key={idx}
                className="w-12 h-12 flex items-center justify-center bg-[#4682B4] rounded text-white font-medium"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      )}

      {array.length > 0 && (
        <div className="mb-4">
          <p className="text-black text-lg font-semibold mt-3">
            Enter the element to search
          </p>
          <input
            type="number"
            value={searchValue}
            onChange={(e) =>
              setSearchValue(e.target.value ? parseInt(e.target.value) : "")
            }
            className="border px-2 py-1 mr-2 text-black rounded"
            placeholder="Enter number to search"
          />
          <button
            className="bg-[#A87B9F] hover:bg-[#875f7f] text-white px-4 py-2 rounded"
            onClick={() =>
              typeof searchValue === "number" && binarySearch(searchValue)
            }
            disabled={searching || array.length === 0}
          >
            Search
          </button>
        </div>
      )}

      {/* Visualization steps */}
      <div className="flex flex-col items-center w-full">
        <div className="w-full flex flex-col items-center">
          {steps.map((step, stepIndex) => {
            const placeholderArray = Array(array.length).fill(null);
            const isLastStep = stepIndex === steps.length - 1;

            return (
              <div key={stepIndex} className="w-full flex justify-center mt-4">
                <div className="flex space-x-2">
                  {placeholderArray.map((_, idx) => {
                    const isInRange =
                      idx >= step.startIndex && idx <= step.endIndex;
                    const stepArrayIndex = isInRange
                      ? idx - step.startIndex
                      : null;
                    const isMidpoint = stepArrayIndex === step.currentIndex;
                    const isFoundElement =
                      isLastStep && found && idx === foundIndex;

                    if (isInRange) {
                      let bgColor = "bg-[#4682B4]";

                      if (isFoundElement) {
                        bgColor = "bg-[#3CB371]";
                      } else if (isMidpoint && !(isLastStep && found)) {
                        bgColor = "bg-yellow-500";
                      }

                      return (
                        <motion.div
                          key={idx}
                          className={`w-12 h-12 flex items-center justify-center rounded text-lg font-semibold text-white
                            ${bgColor}
                            ${
                              stepIndex < steps.length - 1 ? "opacity-50" : ""
                            }`}
                          animate={{
                            scale:
                              (isMidpoint || isFoundElement) && isLastStep
                                ? 1.1
                                : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {array[idx]}
                        </motion.div>
                      );
                    } else {
                      return (
                        <div key={idx} className="w-12 h-12 opacity-0"></div>
                      );
                    }
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {found !== null && (
        <p
          className={`mt-4 text-lg font-semibold px-4 py-2 rounded border-2 
      ${
        found
          ? "border-[#2E8B57] bg-[#E6F4EA] text-[#2E8B57]"
          : "border-[#800000] bg-[#FDECEC] text-[#800000]"
      }`}
        >
          {found
            ? `Element Found at index ${foundIndex} and position ${
                foundIndex !== null ? foundIndex + 1 : "unknown"
              }.`
            : "Element Not Found!"}
        </p>
      )}
    </div>
  );
};

export default BinarySearchVisualizer;
