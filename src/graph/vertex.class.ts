/**
 * This code is licensed under the MIT-License.
 *
 * Author: Tobias Kavšek <tobiaskavsek@hotmail.de>
 */

import { GraphEntity } from './graph-entity.abstract-class';

/** an entity placed in a graph */
export class Vertex<T = undefined> extends GraphEntity {

	/**
	 * default constructor
	 * @param _id unique identifier of a verex
	 * @param label used to categorize vertices
	 * @param properties optional properties containing information about an entity
	 */
	constructor(_id: string, label: string, properties?: { [key: string]: any }) {
		super(_id, label, properties);
	}

}
