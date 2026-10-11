import type {ConduitStatus} from '../conduit/ConduitStatus';

export type CubeConduitInfo<ConduitType extends string = string> = {
	readonly uuid: string;
	readonly type: ConduitType;
	readonly channels: Set<string>;
	readonly status: ConduitStatus;
};
