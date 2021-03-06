interface Problem<S> {
	evalFunction: (solution: S) => number;
	seed: S;
	acceptableSolution?: (evalValue: number) => boolean;
	expandFunction: (solution: S) => Array<S>;
}

interface HillClimbingOptions {
	performSideways?: number;
	maxIterations?: number;
	firstBestCandidate?: boolean;
}

export const hillClimbing = <S>({ evalFunction, seed, expandFunction, acceptableSolution }: Problem<S>, { performSideways, maxIterations, firstBestCandidate }: HillClimbingOptions = {}): { solution: S, eval: number, iterations: number } => {
	let actualSolution = seed, iterationsCount = 0, sidewaysCount = 0;
	let evalValue = evalFunction(actualSolution);

	while (true) {

		// Optional premature end conditions
		if ((acceptableSolution && acceptableSolution(evalValue)) || (maxIterations && iterationsCount >= maxIterations)) return { solution: actualSolution, eval: evalValue, iterations: iterationsCount };

		let bestNeighbor = -1, bestNeighborEval = Number.MIN_SAFE_INTEGER;
		const neighbors = expandFunction(actualSolution);
		const neighborsLength = neighbors.length;

		for (let i = 0; i < neighborsLength; i++) {
			const localEval = evalFunction(neighbors[i]);
			if (localEval >= bestNeighborEval) {
				bestNeighborEval = localEval;
				bestNeighbor = i;
				if (firstBestCandidate) {
					break;
				}
			}
		}

		if (bestNeighborEval < evalValue) {
			return { solution: actualSolution, eval: evalValue, iterations: iterationsCount };
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