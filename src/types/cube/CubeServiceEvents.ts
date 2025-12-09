export type CubeServiceEvents = {
	addConduit: (conduit: string) => void;
	updateConduit: (conduit: string) => void;
	removeConduit: (conduit: string) => void;
};
