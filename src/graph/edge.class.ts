/**
 * This code is licensed under the MIT-License.
 *
 * Author: Tobias Kavšek <tobiaskavsek@hotmail.de>
 */

import { GraphEntity } from './graph-entity.abstract-class';

/** edges connect to vertices in a graph */
export class Edge<T = undefined> extends GraphEntity {

	/** outgoing from vertex id */
	public fromId: string;

	/** incoming to id */
	public toId: string;

	/**
	 * default constructor
	 * @param _id unique identifier of an edge
	 * @param label label to categorize edge
	 * @param fromId vertex id marking from which vertex an edge descends
	 * @param toId vertex id marking to which vertex an edge ascends
	 * @param properties optional properties
	 */
	constructor(_id: string, label: string, fromId: string, toId: string, properties?: { [key: string]: any }) {
		super(_id, label, properties);
		this.fromId = fromId;
		this.toId = toId;
	}
}
