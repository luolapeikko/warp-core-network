export type CubeInjectorInfo = {
	readonly uuid: string;
	/**
	 * list of connection uuids
	 */
	readonly connections: Set<string>;
	readonly status: 'to-be-added';
};
