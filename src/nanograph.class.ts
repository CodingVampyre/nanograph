/**
 * This code is licensed under the MIT-License.
 *
 * Author: Tobias Kavšek <tobiaskavsek@hotmail.de>
 */

import {Vertex} from "./graph/vertex.class";
import {Edge} from "./graph/edge.class";
import {IGraph} from "./graph/graph.interface";
import {ICursor} from "./graph/cursor.interface";

export class Nanograph {

	private graph: IGraph = {vertices: [], edges: [], counter: 0};

	private state: ICursor = { lastEntities: [] };

	/**
	 *
	 */
	private getId(): string { return (this.graph.counter++).toString() }

	/**
	 *
	 * @param label
	 * @param properties
	 */
	public createVertex<T = undefined>(label: string, properties?: T) {
		const _id = this.getId().toString();
		let error: Error | undefined = undefined;

		for (let v of this.graph.vertices) {
			if (v._id === _id) { error = new Error('ERR_DUPLICATE_ID'); }
			else {
				const vertex: Vertex<T> = new Vertex<T>(_id, label, properties);
				this.graph.vertices.push(vertex);
			}
		}

		return { _id: error? _id : undefined, error };
	}

	/**
	 *
	 * @param label
	 * @param from
	 * @param to
	 * @param properties
	 */
	public createEdge<T = undefined>(label: string, from: string, to: string, properties?: T) {
		const _id = this.getId().toString();
		let error: Error | undefined = undefined;

		for (let e of this.graph.edges) {
			if (e._id === _id) { error = new Error('ERR_DUPLICATE_ID'); }
			else {
				const edge: Edge<T> = new Edge<T>(_id, label, from, to, properties);
				this.graph.edges.push(edge);
			}
		}

		return { _id: error? _id : undefined, error };
	}

	public findVertices<T = undefined>(label: string, properties: {}): this {
		const foundVertices: Vertex[] = this.graph.vertices.filter((vertex) => {
			// labels should match
			if (vertex.label === label) {
				// properties should match
				for (let property of Object.keys(properties)) {
					// check if property is not a member of the object prototype
					if (properties.hasOwnProperty(property)) {
						console.log(property);
					}
				}
			}
		});
		this.state.lastEntities = foundVertices;
		return this;
	}

	public findEdges<T = undefined>(label: string, properties: {}): this {
		return this;
	}

	public over(label: string, properties?: {}): this {
		return this;
	}

	public to(label: string, properties?: {}): this {
		return this;
	}

	public getFirst(): Edge | Vertex | undefined {
		return this.state.lastEntities[0];
	}

	public getAll(): Edge[] | Vertex[] {
		return this.state.lastEntities;
	}

	public getVertexCount() {
		return this.graph.vertices.length;
	}

	public getEdgeCount() {
		return this.graph.edges.length;
	}

}
