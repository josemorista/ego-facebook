import { Graph } from "./lib/Graph";

const g = new Graph<string>({
  bilateral: true
});

g.addVertex('1');
g.addVertex('2');
g.addVertex('3');

g.addEdge('1', '2');
g.addEdge('1', '3');

g.print();

