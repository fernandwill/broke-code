export type Example = {
	id: number;
	inputText: string;
	outputText: string;
	explanation?: string;
	img?: string;
};

// local problem data
type Handler<T extends (...args: any[]) => unknown> = (fn: T) => boolean;

export type Problem<T extends (...args: any[]) => unknown = (...args: unknown[]) => unknown> = {
	id: string;
	title: string;
	problemStatement: string;
	examples: Example[];
	constraints: string;
	order: number;
	starterCode: string;
	handlerFunction: Handler<T> | string;
	starterFunctionName: string;
    difficulty: string;
};

export type DBProblem = {
	id: string;
	title: string;
	category: string;
	difficulty: string;
	likes: number;
	dislikes: number;
	order: number;
	videoId?: string;
	link?: string;
};