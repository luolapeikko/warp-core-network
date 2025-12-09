import {ConduitStatus} from './ConduitStatus';

export type ConduitEvents<ConduitDataType> = {
	statusChange: (error: ConduitStatus) => void;
	message: (channel: string, data: ConduitDataType) => void;
	error: (error: Error) => void;
};
