"use client";
import React, { useState } from "react";

const AssessmentTool = () => {
  const [question1, setQuestion1] = useState<string>("");
  const [question2, setQuestion2] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const handleSubmit = () => {
    let score = 0;
    if (question1.toLowerCase() === "yes") {
      score += 1;
    }
    if (question2.toLowerCase() === "yes") {
      score += 1;
    }

    if (score === 2) {
      setResult("Great! You are doing well.");
    } else if (score === 1) {
      setResult("Good, but there's room for improvement.");
    } else {
      setResult("Consider reviewing your approach.");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-gray-800 text-white">
      <h2 className="text-2xl font-bold mb-4">Self-Assessment Tool</h2>
      <div className="mb-4">
        <label
          htmlFor="question1"
          className="block text-sm font-medium text-gray-300"
        >
          Do you regularly set clear goals?
        </label>
        <input
          type="text"
          id="question1"
          value={question1}
          onChange={(e) => setQuestion1(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
          placeholder="Type 'yes' or 'no'"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="question2"
          className="block text-sm font-medium text-gray-300"
        >
          Do you track your progress consistently?
        </label>
        <input
          type="text"
          id="question2"
          value={question2}
          onChange={(e) => setQuestion2(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
          placeholder="Type 'yes' or 'no'"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit Assessment
      </button>
      {result && (
        <div className="mt-4 text-xl font-semibold">
          Result: <span className="text-yellow-400">{result}</span>
        </div>
      )}
    </div>
  );
};

export default AssessmentTool;
