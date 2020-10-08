"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const HillClimbing_1 = require("./lib/Ai/HillClimbing");
const utils_1 = require("./lib/utils");
const usersToSearch = 10;
// Printing our graph to debug purposes
const g = utils_1.loadEgoData(path_1.default.resolve(__dirname, '..', 'facebook_combined.txt'));
// Here is our evaluation function
const evalFunction = (solution) => {
    let sum = 0;
    solution.forEach(el => {
        sum += g.getVertexRelations(el).filter(edge => !solution.includes(edge)).length;
    });
    return sum;
};
// Hill Climbing sideways and with random restarts to find our solutions
const solution = HillClimbing_1.hillClimbing({
    evalFunction,
    expandFunction: (candidateSolution) => {
        let neighbors = [], worstCandidateValue = Number.MAX_SAFE_INTEGER, worstCandidateIndex = -1;
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
}, {
    performSideways: 10
});
console.log('Hill climbing solution:', solution);
