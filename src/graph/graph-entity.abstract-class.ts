export abstract class GraphEntity {

	public _id: string;

	public label: string;

	properties?: { [key: string]: any };

	protected constructor(_id: string, label: string, properties?: { [key: string]: any } ) {
		this._id = _id;
		this.label = label;
		this.properties = properties;
	}

}
