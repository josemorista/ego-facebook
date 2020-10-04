import { Graph } from "./lib/Graph";
import fs from 'fs';
import path from 'path';

const loadEgoData = (filename : string) => {

  const g = new Graph<string>({
    bilateral: true
  });
  
  const egoData = fs.readFileSync(path.resolve(__dirname, filename), {encoding: 'utf-8'});
  const lines = egoData.split('\n');
  const availableVertex : {[key: string] : boolean} = {};
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
  };

  return g;
};



const g = loadEgoData('facebook_combined.txt');

fs.writeFileSync('egoGraph.txt', g.print());

