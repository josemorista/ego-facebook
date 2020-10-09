interface Problem<S> {
	heuristic: (solution: S) => number;
	initialState: S;
	isSolution: (solution: S) => boolean;
	expandFunction: (solution: S) => Array<S>;
}

interface GreedSearchOptions {
	maxIterations?: number;
}

type List = {
	value: number;
	state: any;
	next: List;
} | null;

function addList(l: List, state: any, value: number): List {
	if (!l) {
		return {
			value,
			state,
			next: null
		};
	}
	if (value > l.value) {
		return {
			value,
			state,
			next: l
		};
	}
	l.next = addList(l.next, state, value);
	return l;
}

export const greedSearch = <S>({ heuristic, initialState: initialState, expandFunction, isSolution }: Problem<S>, { maxIterations }: GreedSearchOptions = {}): { solution: S, iterations: number } | null => {
	const explored: Array<S> = [];
	let frontier: List | null = addList(null, initialState, heuristic(initialState));
	let iterationsCount = 0;

	while (true) {

		const current = frontier?.state;
		frontier = frontier?.next || null;

		// Optional premature end conditions
		if ((isSolution(current)) || (maxIterations && iterationsCount >= maxIterations)) {
			return { solution: current, iterations: iterationsCount };
		}

		explored.push(current);

		expandFunction(current).filter(el => !explored.includes(el)).forEach(candidate => {
			frontier = addList(frontier, candidate, heuristic(candidate));
		});

		if (!frontier) {
			return null;
		}

		iterationsCount += 1;
	}

};