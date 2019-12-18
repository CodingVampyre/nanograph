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
	public createVertex(label: string, properties?: { [key: string]: any} ) {
		// create id
		const _id = this.getId();
		let error: Error | undefined = undefined;
		// check for duplicates
		for (let v of this.graph.vertices) {
			if (v._id === _id) { error = new Error('ERR_DUPLICATE_ID'); }
		}
		// insert vertex
		const vertex: Vertex = new Vertex(_id, label, properties);
		this.graph.vertices.push(vertex);

		return { _id: error ? undefined : _id, error };
	}

	/**
	 *
	 * @param label
	 * @param from
	 * @param to
	 * @param properties
	 */
	public createEdge(label: string, from: string, to: string, properties?: { [key: string]: any }) {
		const _id = this.getId();
		let error: Error | undefined = undefined;
		// check for duplicates
		for (let e of this.graph.edges) {
			if (e._id === _id) { error = new Error('ERR_DUPLICATE_ID'); }
		}

		const fromVertex = this.graph.vertices.find(vertex => vertex._id === from);
		if (fromVertex === undefined) { error =  new Error('ERR_VERTEX_MISSING'); }
		const toVertex = this.graph.vertices.find(vertex => vertex._id === to);
		if (toVertex === undefined) { error = new Error('ERR_VERTEX_MISSING'); }

		const edge: Edge = new Edge(_id, label, from, to, properties);
		this.graph.edges.push(edge);

		return { _id: error ? undefined : _id, error };
	}

	public findVertices(label: string, filterProperties?: { [key: string]: any }): this {
		const foundVertices: Vertex[] = this.graph.vertices.filter((vertex) => {
			// labels should match
			if (vertex.label === label) {
				// if no properties are set, no checks must be made
				if (filterProperties === undefined) { return true; }
				// if properties are given but the vertex itself has no properties, filter
				if (vertex.properties === undefined) { return false; }
				// compare properties
				for (let filterPropertyKey of Object.keys(filterProperties)) {
					let vertexProperty;

					// check for id
					if (filterPropertyKey === '_id') { vertexProperty = vertex._id; }
					else { vertexProperty = vertex.properties[filterPropertyKey]; }

					console.log(vertexProperty, 'compare against', filterProperties[filterPropertyKey]);

					if (filterProperties.hasOwnProperty(filterPropertyKey)) {

						console.debug(filterPropertyKey, filterProperties[filterPropertyKey]);
						console.debug(vertex.properties[filterPropertyKey]);

					}
				}
			}
		});
		this.state.lastEntities = foundVertices;
		return this;
	}

	public findEdges(label: string, properties: { [key: string]: any }): this {
		return this;
	}

	public over(label: string, properties?: { [key: string]: any }): this {
		return this;
	}

	public to(label: string, properties?: { [key: string]: any }): this {
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
