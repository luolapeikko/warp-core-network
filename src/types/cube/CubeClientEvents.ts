import {CubeClientStatus} from './CubeClientStatus';

export type CubeClientEvents = {
	status: (error: CubeClientStatus) => void;
	error: (error: Error) => void;
};
