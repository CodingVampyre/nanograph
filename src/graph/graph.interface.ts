import {Vertex} from "./vertex.class";
import {Edge} from "./edge.class";

export interface IGraph {
	counter: number;
	vertices: Vertex<any>[];
	edges: Edge<any>[];
}
