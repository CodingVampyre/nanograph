import {Edge} from "./edge.class";
import {Vertex} from "./vertex.class";

export interface ICursor {
	lastEntities: Edge[] | Vertex[];
}
