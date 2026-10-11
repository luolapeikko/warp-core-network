import type {CubeClientStatus} from './CubeClientStatus';

export type CubeClientEvents = {
	status: [error: CubeClientStatus];
	error: [error: Error];
};
