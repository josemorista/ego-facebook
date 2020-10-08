"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hillClimbing = void 0;
exports.hillClimbing = ({ evalFunction, seed, expandFunction, acceptableSolution }, { performSideways, maxIterations, firstBestCandidate } = {}) => {
    let actualSolution = seed, iterationsCount = 0, sidewaysCount = 0;
    let evalValue = evalFunction(actualSolution);
    while (true) {
        // Optional premature end conditions
        if ((acceptableSolution && acceptableSolution(evalValue)) || (maxIterations && iterationsCount >= maxIterations))
            return { solution: actualSolution, eval: evalValue, iterations: iterationsCount };
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
        }
        else if (evalValue === bestNeighborEval && performSideways && sidewaysCount < performSideways) {
            sidewaysCount += 1;
            actualSolution = neighbors[bestNeighbor];
        }
        else {
            evalValue = bestNeighborEval;
            actualSolution = neighbors[bestNeighbor];
        }
        iterationsCount += 1;
    }
};
