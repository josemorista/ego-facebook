
import fs from 'fs';
import path from 'path';
import { loadEgoData } from './lib/utils';

const usersToSearch = 10;

// Printing our graph to debug purposes
const g = loadEgoData(path.resolve(__dirname, '..', 'facebook_combined.txt'));
fs.writeFileSync(path.resolve(__dirname, '..', 'egoGraph.txt'), g.print());

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

console.log('biggest degrees:', bestSeed);