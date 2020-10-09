import path from 'path';
import { hillClimbing } from './lib/Ai/HillClimbing';
import { loadEgoData } from './lib/utils';

const usersToSearch = 10;

// Printing our graph to debug purposes
const g = loadEgoData(path.resolve(__dirname, '..', 'facebook_combined.txt'));

// Here is our evaluation function
const evalFunction = (solution: Array<string>) => {
	let sum = 0;
	solution.forEach(el => {
		sum += g.getVertexRelations(el).filter(edge => !solution.includes(edge)).length;
	});
	return sum;
};

const expandFunction = (candidateSolution: Array<string>) => {
	let neighbors: Array<string> = [], worstCandidateValue = Number.MAX_SAFE_INTEGER, worstCandidateIndex = -1;
	candidateSolution.forEach((el, index) => {
		const relations = g.getVertexRelations(el);
		if (relations.length < worstCandidateValue) {
			worstCandidateValue = relations.length;
			worstCandidateIndex = index;
		}
		neighbors = [...neighbors, ...relations.filter(el => !candidateSolution.includes(el))];
	});

	return neighbors.map(el => {
		const tmp = [...candidateSolution];
		tmp[worstCandidateIndex] = el;
		return tmp;
	});
};

// Hill Climbing sideways and with random restarts to find our solutions
const hillSolution = hillClimbing<Array<string>>({
	evalFunction,
	expandFunction,
	seed: [...new Array(usersToSearch)].map(() => String(Math.round(Math.random() * g.getVertexCount())))
}, {
	firstBestCandidate: false
});

console.table({
	solution: hillSolution.solution.join(','),
	iterations: hillSolution.iterations,
	evaluation: hillSolution.eval
});
