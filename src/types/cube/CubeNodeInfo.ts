export type CubeNodeInfo = {
	readonly uuid: string;
	/**
	 * list of uuids of conduits that are connected to this injector
	 */
	readonly conduits: Set<string>;
	readonly status: 'to-be-added';
};
