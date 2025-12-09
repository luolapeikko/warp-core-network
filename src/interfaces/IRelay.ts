/**
 * Relay interface to connect two different Conduits and act as a bridge between them.
 */
export interface INode {
	readonly _t: 'relay';
	readonly uuid: string;
}
