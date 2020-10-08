"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = void 0;
class Graph {
    constructor({ bilateral }) {
        this.vertices = [];
        this.edges = new Map();
        this.numberOfEdges = 0;
        this.bilateral = bilateral;
    }
    addVertex(vertex) {
        this.vertices.push(vertex);
        this.edges.set(vertex, []);
    }
    removeVertex(vertex) {
        var _a;
        this.vertices = this.vertices.filter(el => el !== vertex);
        if (this.bilateral) {
            while (this.edges.get(vertex)) {
                const adjacentVertex = (_a = this.edges.get(vertex)) === null || _a === void 0 ? void 0 : _a.pop();
                if (adjacentVertex) {
                    this.removeEdge(adjacentVertex, vertex);
                }
            }
        }
        this.edges.delete(vertex);
    }
    removeEdge(vertex1, vertex2) {
        var _a, _b;
        if (this.edges.get(vertex1)) {
            this.numberOfEdges--;
            this.edges.set(vertex1, ((_a = this.edges.get(vertex1)) === null || _a === void 0 ? void 0 : _a.filter(el => el !== vertex2)) || []);
            if (this.bilateral) {
                this.edges.set(vertex2, ((_b = this.edges.get(vertex2)) === null || _b === void 0 ? void 0 : _b.filter(el => el !== vertex1)) || []);
            }
        }
    }
    addEdge(vertex1, vertex2) {
        this.edges.set(vertex1, [...(this.edges.get(vertex1) || []), vertex2]);
        this.numberOfEdges++;
        if (this.bilateral) {
            this.edges.set(vertex2, [...(this.edges.get(vertex2) || []), vertex1]);
            this.numberOfEdges++;
        }
    }
    getVertexCount() {
        return this.vertices.length;
    }
    getRelationsCount() {
        return this.numberOfEdges;
    }
    getVertexRelations(vertex) {
        return this.edges.get(vertex) || [];
    }
    print() {
        return this.vertices.map(vertex => {
            var _a;
            return `${JSON.stringify(vertex)} => ${(_a = this.edges.get(vertex)) === null || _a === void 0 ? void 0 : _a.join(', ')}`;
        }).join('\n');
    }
}
exports.Graph = Graph;
