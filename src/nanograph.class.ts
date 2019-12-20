/**
 * This code is licensed under the MIT-License.
 *
 * Author: Tobias Kavšek <tobiaskavsek@hotmail.de>
 */

import {Vertex} from "./graph/vertex.class";
import {Edge} from "./graph/edge.class";
import {IGraph} from "./graph/graph.interface";

export class Nanograph {

	/** contains entities and a counter to grant uniqueness to IDs */
	private graph: IGraph = {vertices: [], edges: [], counter: 0};

	/** cursor to work with currently selected entities */
	private selectedEntities: Edge[] | Vertex[] = [];

	/**
	 * returns a unique identifier by incrementing a counter
	 * @return an id, a stringified number
	 */
	private getId(): string { return (this.graph.counter++).toString() }

	/**
	 * creates a new vertex in the graph
	 * @param label category of a vertex to grant simpler management
	 * @param properties a key value object containing data for an entitiy
	 * @return an object containing the ID and an error object
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
	 * creates a new edge connecting two vertices
	 * @param label category of said label
	 * @param from vertex id from which the edge will be drawn
	 * @param to vertex id to which the edge will be drawn
	 * @param properties metadata containing information about edges
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

	/**
	 * searches and caches a list of vertices matching provided data
	 * @param label category of the vertex to find
	 * @param filterProperties either an id as string or an object containing properties to filter
	 * @return this
	 */
	public findVertices(label: string, filterProperties?: { [key: string]: any } | string): this {
		this.selectedEntities = this.graph.vertices.filter((vertex) => {
			// labels should match
			if (vertex.label === label) {
				// if no properties are set, no checks must be made
				if (filterProperties === undefined) { return true; }
				// if properties are given but the vertex itself has no properties, filter
				if (vertex.properties === undefined) { return false; }

				// compare IDs
				if (typeof filterProperties === 'string' && vertex._id === filterProperties) { return true; }

				// compare properties
				return Nanograph.compareProperties(filterProperties as {[key: string]: any}, vertex);
			}
		});
		return this;
	}

	/**
	 * finds edges by provided data and caches them
	 * @param label category of edges
	 * @param filterProperties either an edge id or an object containing properties to filter
	 * @return this
	 */
	public findEdges(label: string, filterProperties: { [key: string]: any } | string): this {
		this.selectedEntities = this.graph.edges.filter((edge) => {
			// labels should match
			if (edge.label === label) {
				// if no properties are set, no checks must be made
				if (filterProperties === undefined) { return true; }
				// if properties are given but the vertex itself has no properties, filter
				if (edge.properties === undefined) { return false; }
				// compare IDs
				if (typeof filterProperties === 'string' && edge._id === filterProperties) { return true; }
				// compare properties
				return Nanograph.compareProperties(filterProperties as {[key: string]: any}, edge);
			}
		});
		return this;
	}

	/**
	 * jumps to an edge connected to a cached vertex and filters by optional properties
	 * @param label label of an edge
	 * @param properties optional data to filter unwanted edges
	 * @return this
	 */
	public over(label: string, properties?: { [key: string]: any }): this {
		// for every entity in the queue
		const newEntities: Edge[] = [];
		for (let vertex of this.selectedEntities) {
			// for every edge, look if it derices from a given vertex
			for (let edge of this.graph.edges) {
				if (edge.fromId === vertex._id && edge.label === label) {
					if (properties !== undefined) {
						if (Nanograph.compareProperties(properties, edge)) { newEntities.push(edge); }
					} else { newEntities.push(edge); }
				}
			}
		}
		this.selectedEntities = newEntities;

		return this;
	}

	/**
	 * jumps from cached edges to connected vertices
	 * @param label label of wanted vertices
	 * @param properties optional to filter out unwanted vertices
	 * @return this
	 */
	public to(label: string, properties?: { [key: string]: any }): this {
		const newEntities: Vertex[] = [];

		// for every entity in the queue
		for (let edge of this.selectedEntities) {
			// for every edge, look if it derices from a given vertex
			for (let vertex of this.graph.vertices) {
				const areIdsMatching = (edge as Edge).toId === vertex._id;
				const areLabelsMatching = vertex.label === label;

				if (areIdsMatching && areLabelsMatching) {
					// if properties are set, compare them.
					// if not, the vertex is always valid
					if (properties !== undefined) {
						// compare properties and push vertex on success
						const arePropertiesMatching = Nanograph.compareProperties(properties, vertex);
						if (arePropertiesMatching) { newEntities.push(vertex); }
					} else { newEntities.push(vertex); }
				}
			}
		}
		this.selectedEntities = newEntities;
		return this;
	}

	/**
	 * returns the first cached element and clears the cache
	 * @return an edge or a vertex if existing, undefined if not
	 */
	public getFirst(): Edge | Vertex | undefined {
		const returnEntity = this.selectedEntities[0];
		this.clearState();
		return returnEntity;
	}

	/**
	 * returns all cached vertices or edges and clears the cache
	 * @return an array of edges or vertices
	 */
	public getAll(): Edge[] | Vertex[] {
		const entities = this.selectedEntities;
		this.clearState();
		return entities;
	}

	/**
	 * deletes a vertex by id
	 * @param vertexId vertex identifier
	 */
	public deleteVertex(vertexId: string): void {
		// remove vertices
		this.graph.vertices = this.graph.vertices.filter((vertex) =>
			vertex._id !== vertexId);
		// remove all attached edges
		this.graph.edges = this.graph.edges.filter((edge) =>
			edge.fromId !== vertexId && edge.toId !== vertexId);
	}

	/**
	 * deletes an edge by id
	 * @param edgeId edge identifier
	 */
	public deleteEdge(edgeId: string): void {
		this.graph.edges = this.graph.edges.filter((edge) =>
			edge._id !== edgeId);
	}

	/**
	 * updates a vertex
	 * @param vertexId id of the vertex to be updated
	 * @param newProperties an object containing values to write into the vertex
	 */
	public updateVertex(vertexId: string, newProperties: {[key: string]: any}): void {
		this.graph.vertices.map((vertex) => {
			if (vertex._id === vertexId) {
				const keys = Object.keys(newProperties);
				if (vertex.properties === undefined) { vertex.properties = {}; }
				for (let key of keys) { vertex.properties[key] = newProperties[key]; }
			}
		});
	}

	/**
	 * updates an edge
	 * @param edgeId id of the edge to be updated
	 * @param newProperties an object containing values to write into the vertex
	 */
	public updateEdge(edgeId: string, newProperties: {[key: string]: any}): void {
		this.graph.edges.map((edge) => {
			if (edge._id === edgeId) {
				const keys = Object.keys(newProperties);
				if (edge.properties === undefined) { edge.properties = {}; }
				for (let key of keys) { edge.properties[key] = newProperties[key]; }
			}
		});
	}

	/**
	 * counts all vertices
	 * @return how many vertices are in the graph
	 */
	public getVertexCount(): number {
		return this.graph.vertices.length;
	}

	/**
	 * counts all edges
	 * @return how many edges are in the graph
	 */
	public getEdgeCount(): number {
		return this.graph.edges.length;
	}

	/**
	 * displays all vertices, edges and the counter to enable outside handing
	 * @return a graph
	 */
	public toObject(): IGraph {
		return this.graph;
	}

	/**
	 * takes a graph and overwrites the internal graph
	 * @param graph an object containing vertices and edges
	 */
	public fromObject(graph: IGraph): void {
		this.graph = graph;
	}

	/**
	 * compares properties in objects
	 * @param filterProperties a list of properties to match in a vertex or edge
	 * @param entity a vertex or edge containing properties
	 */
	private static compareProperties(filterProperties: {[key: string]: any}, entity: Vertex | Edge ): boolean {
		if (entity.properties === undefined) return false;

		for (let filterPropertyKey of Object.keys(filterProperties)) {
			filterProperties = filterProperties as { [key: string]: any }; // there is no more string
			const filterProperty = filterProperties[filterPropertyKey];
			const vertexProperty = entity.properties[filterPropertyKey];

			// equality check
			if (filterProperty.equals !== vertexProperty) { return false; }
		}

		// true if all parameters are compared successfully
		return true;
	}

	private clearState() { this.selectedEntities = []; }

}
