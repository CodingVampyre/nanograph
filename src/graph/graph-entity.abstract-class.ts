/**
 * This code is licensed under the MIT-License.
 *
 * Author: Tobias Kavšek <tobiaskavsek@hotmail.de>
 */

/** used to represent entities in a graph */
export abstract class GraphEntity {

	/** unique identifier of the entity */
	public _id: string;

	/** used to categorize entities */
	public label: string;

	/** properties contain data about an entity */
	public properties?: { [key: string]: any };

	/**
	 * default constructor
	 * @param _id unique identifier
	 * @param label used to categorize entities
	 * @param properties contain data about an entity
	 */
	protected constructor(_id: string, label: string, properties?: { [key: string]: any } ) {
		this._id = _id;
		this.label = label;
		this.properties = properties;
	}

}
