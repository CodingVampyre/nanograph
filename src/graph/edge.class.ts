import {GraphEntity} from './graph-entity.abstract-class';

export class Edge<T = undefined> extends GraphEntity {

	constructor(_id: string, label: string, fromId: string, toId: string, properties?: { [key: string]: any }) {
		super(_id, label, properties);
		this.fromId = fromId;
		this.toId = toId;
	}

	public fromId: string;

	public toId: string;
}
