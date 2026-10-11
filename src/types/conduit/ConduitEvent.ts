import type {ConduitStatus} from './ConduitStatus';

export type ConduitEvents<ConduitDataType> = {
	statusChange: [error: ConduitStatus];
	message: [channel: string, data: ConduitDataType];
	error: [error: Error];
};
