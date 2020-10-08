"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./lib/utils");
const usersToSearch = 10;
// Printing our graph to debug purposes
const g = utils_1.loadEgoData(path_1.default.resolve(__dirname, '..', 'facebook_combined.txt'));
fs_1.default.writeFileSync(path_1.default.resolve(__dirname, '..', 'egoGraph.txt'), g.print());
// First, let's get the elements with the biggest degree
let bestSeed = [];
const vertexCount = g.getVertexCount();
for (let i = 0; i < vertexCount; i++) {
    const vertex = String(i);
    const localEval = g.getVertexRelations(vertex).length;
    if (bestSeed.length < usersToSearch) {
        bestSeed.push({
            solution: vertex,
            eval: localEval
        });
    }
    else {
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
