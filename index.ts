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

// Here is our evaluation function
const evalFunction = (s: string) => g.getVertexRelations(s).length;

// First, let's get the ground truth
let groundTruthArray: Array<{ solution: string, eval: number }> = [];
const vertexCount = g.getVertexCount();
for (let i = 0; i < vertexCount; i++) {
	const vertex = String(i);
	const localEval = evalFunction(vertex);
	if (groundTruthArray.length < 5) {
		groundTruthArray.push({
			solution: vertex,
			eval: localEval
		});
	} else {
		let minIndex = 0, minValue = groundTruthArray[0].eval;
		groundTruthArray.forEach((el, index) => {
			if (el.eval < minValue) {
				minValue = el.eval;
				minIndex = index;
			}
		});
		if (groundTruthArray[minIndex].eval < localEval) {
			groundTruthArray[minIndex] = {
				solution: vertex,
				eval: localEval
			};
		}
	}
}
groundTruthArray = groundTruthArray.sort((a, b) => b.eval - a.eval);


// Hill Climbing sideways and with random restarts to find our solutions
let solutionsArray: Array<{ solution: string, eval: number }> = [];
for (let i = 0; i < 5; i++) {
	const candidates = [...new Array(5)].map(() => hillClimbing<string>({
		evalFunction,
		initialState: {
			solution: String(Math.round(Math.random() * vertexCount)),
			explored: solutionsArray.map(el => el.solution)
		},
		expandFunction: (s) => g.getVertexRelations(s)
	}, {
		performSideways: 100
	}));
	let bestCandidate = candidates[0];
	candidates.forEach(candidate => {
		if (candidate.eval > bestCandidate.eval) {
			bestCandidate = candidate;
		}
	});
	solutionsArray.push(bestCandidate);
}
solutionsArray = solutionsArray.sort((a, b) => b.eval - a.eval);

// Logging our solutions and groundTruth
console.log('groundTruth:', groundTruthArray);
console.log('solutions:', solutionsArray);