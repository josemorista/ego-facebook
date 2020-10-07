interface Problem<S> {
	evalFunction: (solution: S) => number;
	initialState: {
		solution: S;
		explored: Array<S>;
	};
	acceptableSolution?: (evalValue: number) => boolean;
	expandFunction: (solution: S) => Array<S>;
}

interface HillClimbingOptions {
	performSideways?: number;
	maxIterations?: number;
}

export const hillClimbing = <S>({ evalFunction, initialState: { solution, explored }, expandFunction, acceptableSolution }: Problem<S>, { performSideways, maxIterations }: HillClimbingOptions = {}): { solution: S, eval: number } => {
	const exploredStates: Array<S> = explored;
	let actualSolution = solution, iterationsCount = 0, sidewaysCount = 0;
	let evalValue = evalFunction(actualSolution);

	while (true) {

		// Optional premature end conditions
		if (acceptableSolution && acceptableSolution(evalValue)) return { solution: actualSolution, eval: evalValue };
		if (maxIterations && iterationsCount >= maxIterations) return { solution: actualSolution, eval: evalValue };

		let bestNeighbor = -1, bestNeighborEval = Number.MIN_SAFE_INTEGER;
		const neighbors = expandFunction(actualSolution).filter(el => !exploredStates.includes(el));
		const neighborsLength = neighbors.length;
		for (let i = 0; i < neighborsLength; i++) {
			exploredStates.push(neighbors[i]);
			const localEval = evalFunction(neighbors[i]);
			if (localEval >= bestNeighborEval) {
				bestNeighborEval = localEval;
				bestNeighbor = i;
			}
		}
		if (bestNeighborEval < evalValue) {
			return { solution: actualSolution, eval: evalValue };
		} else if (evalValue === bestNeighborEval && performSideways && sidewaysCount < performSideways) {
			sidewaysCount += 1;
			actualSolution = neighbors[bestNeighbor];
		} else {
			evalValue = bestNeighborEval;
			actualSolution = neighbors[bestNeighbor];
		}
		iterationsCount += 1;
	}

};