import assert from "assert";
import {toast} from "react-toastify";
import {Problem} from "../types/problem";

type TwoSumSolver = (nums: number[], target: number) => number[];

const starterCodeTwoSum = `const twoSum = (nums, target) {
    // Write your code here
}`

const handlerTwoSum = (fn: TwoSumSolver): boolean => {
    try {
        const nums = [[2, 7, 9, 11, 15], [3, 2, 4], [3, 3]];
        const target = [9, 6, 6];
        const answer = [[0, 1], [1, 2], [0, 1]]

        // loop all tests to see if the user's code is correct or not
        for (let i = 0; i < nums.length; i++) {
            const result = fn(nums[i], target[i]);
            assert.deepStrictEqual(result, answer[i]);
        }
        return true;

    } catch (error:unknown) {
        toast.error("Two Sum handler function error.");
        throw (error instanceof Error ? error : new Error(String(error)));
    }
}

export const twoSum: Problem<TwoSumSolver> = {
    id: "two-sum",
    title: "1. Two Sum",
    problemStatement: `<p className="mt-3">Given an array of integers <code>nums</code> and an integer <code>target</code>, return<em>indices of the two numbers such that they add up to</em> <code>target</code>.</p>
    <p className="mt-3">You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
    <p className="mt-3">You can return the answer in any order.</p>`,
    examples: [
        {
            id: 1,
            inputText: "nums = [2, 7, 9, 11, 15], target = 9",
            outputText: "[0, 1]",
            explanation: "Because nums[0] + nums[1] === 9, we return [0, 1].",
        },
        {
            id: 2,
            inputText: "nums = [3, 2, 4], target = 6",
            outputText: "[1, 2]",
            explanation: "Because nums[1] + nums[2] === 6, we return [1, 2].",
        },
        {
            id: 3,
            inputText: "nums = [3, 3], target = 6",
            outputText: "[0, 1]",
            explanation: "Because nums[0] + nums[1] === 6, we return [0, 1].",
        },
    ],
    constraints: `<li className="mt-2">
	<code>2 ≤ nums.length ≤ 10</code>
	</li>
    <li className="mt-2">
	<code>-10 ≤ nums[i] ≤ 10</code>
	</li>
	<li className="mt-2">
	<code>-10 ≤ target ≤ 10</code>
	</li>
	<li className="mt-2 text-sm">
	<strong>Only one valid answer exists.</strong>
	</li>`,
    handlerFunction: handlerTwoSum,
    starterCode: starterCodeTwoSum,
    order: 1,
    difficulty: "Easy",
    starterFunctionName: "const twoSum",
}


