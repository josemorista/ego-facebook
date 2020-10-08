import { Graph } from './lib/Graph';
import fs from 'fs';
import path from 'path';
import { greedSearch } from './lib/Ai/GreedSearch';

const usersToSearch = 10;

const loadEgoData = (filename: string) => {
	const g = new Graph<string>({
		bilateral: true
	});
	const egoData = fs.readFileSync(path.resolve(__dirname, filename), { encoding: 'utf-8' });
	const lines = egoData.split('\n');
	const availableVertex: { [key: string]: boolean } = {};
	for (const line of lines) {
		const [vertex, adjacentVertex] = line.split(' ').map(el => el.trim());
		if (vertex && adjacentVertex) {
			if (!availableVertex[vertex]) {
				g.addVertex(vertex);
				availableVertex[vertex] = true;
			}
			if (!availableVertex[adjacentVertex]) {
				g.addVertex(adjacentVertex);
				availableVertex[adjacentVertex] = true;
			}
			g.addEdge(vertex, adjacentVertex);
		}
	}
	return g;
};

// Printing our graph to debug purposes
const g = loadEgoData('facebook_combined.txt');

// Here is our heuristic function
const heuristic = (solution: Array<string>) => {
	let sum = 0;
	solution.forEach(el => {
		sum += g.getVertexRelations(el).filter(edge => !solution.includes(edge)).length;
	});
	return sum;
};

let lastSolution = -1;

const solution = greedSearch<Array<string>>({
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

console.log(solution);