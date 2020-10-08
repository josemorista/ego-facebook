import path from 'path';
import { greedSearch } from './lib/Ai/GreedSearch';
import { loadEgoData } from './lib/utils';

const usersToSearch = 10;

// Printing our graph to debug purposes
const g = loadEgoData(path.resolve(__dirname, '..', 'facebook_combined.txt'));

// Here is our heuristic function
const heuristic = (solution: Array<string>) => {
	let sum = 0;
	solution.forEach(el => {
		sum += g.getVertexRelations(el).filter(edge => !solution.includes(edge)).length;
	});
	return sum;
};

let lastSolution = -1;

const greedySolution = greedSearch<Array<string>>({
	heuristic,
	expandFunction: (candidateSolution) => {
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
	},
	isSolution: (solution) => {
		const current = heuristic(solution);
		if (lastSolution >= current) return true;
		lastSolution = current;
		return false;
	},
	initialState: [...new Array(usersToSearch)].map(() => String(Math.round(Math.random() * g.getVertexCount())))
});

console.log('Greedy search solution:', greedySolution);