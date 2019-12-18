export abstract class GraphEntity<T = undefined> {

	public _id: string;

	public label: string;

	properties?: T;

	constructor(_id: string, label: string, properties?: T) {
		this._id = _id;
		this.label = label;
		this.properties = properties;
	}

}
