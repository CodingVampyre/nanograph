export abstract class GraphEntity<T = undefined> {

	public _id: string;

	properties?: T;

	constructor(_id: string, properties?: T) {
		this._id = _id;
		this.properties = properties;
	}

}
