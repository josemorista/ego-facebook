import { Graph } from './lib/Graph';
import fs from 'fs';
import path from 'path';
import { hillClimbing } from './lib/Ai/HillClimbing';

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
fs.writeFileSync('egoGraph.txt', g.print());


// First, let's get the elements with the biggest degree
let bestSeed: Array<{ solution: string, eval: number }> = [];
const vertexCount = g.getVertexCount();
for (let i = 0; i < vertexCount; i++) {
	const vertex = String(i);
	const localEval = g.getVertexRelations(vertex).length;
	if (bestSeed.length < usersToSearch) {
		bestSeed.push({
			solution: vertex,
			eval: localEval
		});
	} else {
		let minIndex = 0, minValue = bestSeed[0].eval;
		bestSeed.forEach((el, index) => {
			if (el.eval < minValue) {
				minValue = el.eval;
				minIndex = index;
			}
		});
		if (bestSeed[minIndex].eval < localEval) {
			bestSeed[minIndex] = {
				solution: vertex,
				eval: localEval
			};
		}
	}
}
bestSeed = bestSeed.sort((a, b) => b.eval - a.eval);

// Here is our evaluation function
const evalFunction = (solution: Array<string>) => {
	let sum = 0;
	solution.forEach(el => {
		sum += g.getVertexRelations(el).filter(edge => !solution.includes(edge)).length;
	});
	return sum;
};

// Hill Climbing sideways and with random restarts to find our solutions
const solution = hillClimbing<Array<string>>({
	evalFunction,
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
	seed: [...new Array(usersToSearch)].map(() => String(Math.round(Math.random() * g.getVertexCount())))
	//seed: bestSeed.map(el => el.solution),
}, {
	performSideways: 10
});

// Logging our solutions and groundTruth
console.log('biggest degree:', bestSeed);
console.log(solution);
