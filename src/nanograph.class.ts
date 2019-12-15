/**
 * This code is licensed under the MIT-License.
 *
 * Author: Tobias Kavšek <tobiaskavsek@hotmail.de>
 */

export class Nanograph {

	private vertices: Vertex[] = [];

	private edges: Edge[] = [];

	public createVertex<T>(vertexLabel: string, properties?: T) {
		const id = '';
		let error: Error | undefined = undefined;

		return { id, error };
	}

	public createEdge<T>(edgeLabel: string, from: string, to: string, properties?: T) {
		const id = '';
		let error: Error | undefined = undefined;

		return { id, error };
	}

	public findVertexById(label: string, id: string): any {
		return undefined;
	}

	public findVertexByProperties(label: string, properties: {}) {
		return [];
	}

	public findEdgesById(label: string, id: string) {
		return undefined;
	}

	public findEdgesByProperties(label: string, properties: {}) {
		return [];
	}

	public getVertexCount() {
		return this.vertices.length;
	}

	public getEdgeCount() {
		return this.edges.length;
	}

}

export class Vertex {

}

export class Edge {

}
