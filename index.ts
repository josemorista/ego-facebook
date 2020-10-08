import { Graph } from './lib/Graph';
import fs from 'fs';
import path from 'path';
import { hillClimbing } from './lib/Ai/HillClimbing';

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
let seed: Array<{ solution: string, eval: number }> = [];
const vertexCount = g.getVertexCount();
for (let i = 0; i < vertexCount; i++) {
	const vertex = String(i);
	const localEval = g.getVertexRelations(vertex).length;
	if (seed.length < 5) {
		seed.push({
			solution: vertex,
			eval: localEval
		});
	} else {
		let minIndex = 0, minValue = seed[0].eval;
		seed.forEach((el, index) => {
			if (el.eval < minValue) {
				minValue = el.eval;
				minIndex = index;
			}
		});
		if (seed[minIndex].eval < localEval) {
			seed[minIndex] = {
				solution: vertex,
				eval: localEval
			};
		}
	}
}
seed = seed.sort((a, b) => b.eval - a.eval);

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
		const neighbors: Array<Array<string>> = [];
		candidateSolution.forEach(el => {
			const edges = g.getVertexRelations(el).filter(el => !candidateSolution.includes(el));
			edges.forEach(edge => {
				for (let i = 0; i < candidateSolution.length; i++) {
					const tmp = [...candidateSolution[i]];
					tmp[i] = edge;
					neighbors.push(tmp);
				}
			});
		});
		return neighbors;
	},
	seed: seed.map(el => el.solution),
}, {
	performSideways: 5
});

// Logging our solutions and groundTruth
console.log('biggest degree:', seed);
console.log(solution);
