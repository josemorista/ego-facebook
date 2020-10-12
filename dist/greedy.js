"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const GreedSearch_1 = require("./lib/Ai/GreedSearch");
const utils_1 = require("./lib/utils");
const usersToSearch = 10;
// Printing our graph to debug purposes
const g = utils_1.loadEgoData(path_1.default.resolve(__dirname, '..', 'facebook_combined.txt'));
// Here is our heuristic function
const heuristic = (solution) => {
    let sum = 0;
    solution.forEach(el => {
        sum += g.getVertexRelations(el).filter(edge => !solution.includes(edge)).length;
    });
    return sum;
};
let lastSolution = -1;
const greedySolution = GreedSearch_1.greedSearch({
    heuristic,
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
    isSolution: (solution) => {
        const current = heuristic(solution);
        if (lastSolution >= current)
            return true;
        lastSolution = current;
        return false;
    },
    initialState: [...new Array(usersToSearch)].map(() => String(Math.round(Math.random() * g.getVertexCount())))
});
console.table({
    solution: greedySolution === null || greedySolution === void 0 ? void 0 : greedySolution.solution.join(','),
    iterations: greedySolution === null || greedySolution === void 0 ? void 0 : greedySolution.iterations,
    evaluation: heuristic((greedySolution === null || greedySolution === void 0 ? void 0 : greedySolution.solution) || [])
});
