"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEgoData = void 0;
const Graph_1 = require("../Graph");
const fs_1 = __importDefault(require("fs"));
exports.loadEgoData = (filename) => {
    const g = new Graph_1.Graph({
        bilateral: true
    });
    const egoData = fs_1.default.readFileSync(filename, { encoding: 'utf-8' });
    const lines = egoData.split('\n');
    const availableVertex = {};
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
