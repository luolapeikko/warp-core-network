import TypedEmitter from 'typed-emitter';
import {ConduitEvents} from '../types/conduit/ConduitEvent';
import {ConduitStatus} from '../types/conduit/ConduitStatus';

export interface IConduit<ConduitType extends string, ConduitDataType> extends TypedEmitter<ConduitEvents<ConduitDataType>> {
	readonly _t: 'conduit';
	readonly uuid: string;
	readonly type: ConduitType;
	registerChannel(channel: string): void | Promise<void>;
	unregisterChannel(channel: string): void | Promise<void>;
	listen(): void | Promise<void>;
	close(): void | Promise<void>;
	listChannels(): Set<string> | Promise<Set<string>>;
	getStatus(): ConduitStatus;
	write(channel: string, data: ConduitDataType): void | Promise<void>;
}
