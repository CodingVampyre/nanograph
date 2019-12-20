/**
 * This code is licensed under the MIT-License.
 *
 * Author: Tobias Kavšek <tobiaskavsek@hotmail.de>
 */

import { Vertex } from './vertex.class';
import { Edge } from './edge.class';

/** a graph consisting of vertices and edges */
export interface IGraph {

	/** will be incremented to generate id's */
	counter: number;

	/** vertices represent entities */
	vertices: Vertex[];

	/** edges represent connections between vertices */
	edges: Edge[];
}
