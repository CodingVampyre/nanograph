/**
 * This code is licensed under the MIT-License.
 *
 * Author: Tobias Kavšek <tobiaskavsek@hotmail.de>
 */

import {Vertex} from "./graph-entities/vertex.class";
import {Edge} from "./graph-entities/edge.class";

export class Nanograph {

	private vertices: Vertex[] = [];

	private edges: Edge[] = [];

	private state: IQueryState = {
		lastEntities: [],
	};

	public createVertex<T>(vertexLabel: string, properties?: T) {
		const _id = '';
		let error: Error | undefined = undefined;

		return { _id, error };
	}

	public createEdge<T>(edgeLabel: string, from: string, to: string, properties?: T) {
		const _id = '';
		let error: Error | undefined = undefined;

		return { _id, error };
	}

	public findVertices<T = undefined>(label: string, properties: {}): this {
		return this;
	}

	public findEdges<T = undefined>(label: string, properties: {}): this {
		return this;
	}

	public getFirst(): Edge | Vertex | undefined {
		return undefined;
	}

	public getAll(): Edge[] | Vertex[] {
		return [];
	}

	public getVertexCount() {
		return this.vertices.length;
	}

	public getEdgeCount() {
		return this.edges.length;
	}

}

interface IQueryState {
	lastEntities: Edge[] | Vertex[] | undefined,
}
