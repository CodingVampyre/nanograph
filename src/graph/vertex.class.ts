import {GraphEntity} from "./graph-entity.abstract-class";

export class Vertex<T = undefined> extends GraphEntity<T> {

	constructor(_id: string, label: string, properties?: T) {
		super(_id, label, properties);
	}

}
