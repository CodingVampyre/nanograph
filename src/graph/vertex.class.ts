import {GraphEntity} from "./graph-entity.abstract-class";

export class Vertex<T = undefined> extends GraphEntity {

	constructor(_id: string, label: string, properties?: { [key: string]: any }) {
		super(_id, label, properties);
	}

}
