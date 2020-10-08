"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.greedSearch = void 0;
function addList(l, state, value) {
    if (!l) {
        return {
            value,
            state,
            next: null
        };
    }
    if (value > l.value) {
        return {
            value,
            state,
            next: l
        };
    }
    l.next = addList(l.next, state, value);
    return l;
}
exports.greedSearch = ({ heuristic, initialState: initialState, expandFunction, isSolution }, { maxIterations } = {}) => {
    const explored = [];
    let frontier = addList(null, initialState, heuristic(initialState));
    let iterationsCount = 0;
    while (true) {
        const current = frontier === null || frontier === void 0 ? void 0 : frontier.state;
        console.log(frontier === null || frontier === void 0 ? void 0 : frontier.value);
        frontier = (frontier === null || frontier === void 0 ? void 0 : frontier.next) || null;
        // Optional premature end conditions
        if ((isSolution && isSolution(current)) || (maxIterations && iterationsCount >= maxIterations))
            return { solution: current, iterations: iterationsCount };
        explored.push(current);
        expandFunction(current).filter(el => !explored.includes(el)).forEach(candidate => {
            frontier = addList(frontier, candidate, heuristic(candidate));
        });
        if (!frontier) {
            return { solution: current, iterations: iterationsCount };
        }
        iterationsCount += 1;
    }
};
