interface Problem<S> {
	heuristic: (solution: S) => number;
	initialState: S;
	isSolution: (solution: S) => boolean;
	expandFunction: (solution: S) => Array<S>;
}

interface GreedSearchOptions {
	maxIterations?: number;
}

export const greedSearch = <S>({ heuristic, initialState: initialState, expandFunction, isSolution }: Problem<S>, { maxIterations }: GreedSearchOptions = {}): { solution: S, iterations: number } => {
	const explored: Array<S> = [];
	let frontier: Array<S> = [initialState];
	let iterationsCount = 0;

	while (true) {

		const current = frontier.shift() || {} as S;
		// Optional premature end conditions
		if ((isSolution && isSolution(current)) || (maxIterations && iterationsCount >= maxIterations)) return { solution: current, iterations: iterationsCount };

		explored.push(current);

		frontier = [...frontier, ...expandFunction(current).filter(el => !explored.includes(el))].sort((a, b) => heuristic(b) - heuristic(a));

		if (frontier.length === 0) {
			return { solution: current, iterations: iterationsCount };
		}

		iterationsCount += 1;
	}

};