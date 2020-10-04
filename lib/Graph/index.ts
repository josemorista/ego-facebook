interface GraphProps {
  bilateral : boolean;
}

export class Graph<V> {

  vertices : Array<V>;
  edges: Map<V, Array<V>>;
  private numberOfEdges: number;
  bilateral: boolean;

  constructor ({bilateral} : GraphProps) {
    this.vertices = [];
    this.edges = new Map();
    this.numberOfEdges = 0;
    this.bilateral = bilateral
  }

  addVertex (vertex: V) {
    this.vertices.push(vertex);
    this.edges.set(vertex, []);
  }

  removeVertex (vertex : V) {
    this.vertices = this.vertices.filter(el => el !== vertex);
    
    if (this.bilateral) {
      while (this.edges.get(vertex)) {
        const adjacentVertex = this.edges.get(vertex)?.pop();
        if (adjacentVertex) {
          this.removeEdge(adjacentVertex, vertex);
        }
      }
    } 
    
    this.edges.delete(vertex);
  }

  removeEdge (vertex1 : V, vertex2: V) {
    if (this.edges.get(vertex1)) {
      this.numberOfEdges--;
      this.edges.set(vertex1, this.edges.get(vertex1)?.filter(el => el !== vertex2) || []);
      if (this.bilateral) {
        this.edges.set(vertex2, this.edges.get(vertex2)?.filter(el => el !== vertex1) || []);
      }
    }
  }

  addEdge (vertex1 : V, vertex2 : V) {
    this.edges.set(vertex1, [...(this.edges.get(vertex1) || []), vertex2]);
    this.numberOfEdges++;
    if (this.bilateral) {
      this.edges.set(vertex2, [...(this.edges.get(vertex2) || []), vertex1]);
      this.numberOfEdges++;
    }
  }

  getSize () {
    return this.vertices.length;
  }

  getRelationsSize () {
    return this.numberOfEdges;
  }

  print () {
    return this.vertices.map(vertex => {
      return `${JSON.stringify(vertex)} => ${this.edges.get(vertex)?.join(', ')}`;
    }).join('\n');
  }

}
