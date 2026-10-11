import type {EventEmitter} from 'events';
import type {CubeClientEvents} from '../types/cube/CubeClientEvents';
import type {IConduit} from './IConduit';
import type {IInjector} from './IInjector';
import type {INode} from './INode';

type AnyTargetClient = IConduit<string, unknown> | INode | IInjector;

export interface ICubeClient extends EventEmitter<CubeClientEvents> {
	connect(nameSpace: string): void | Promise<void>;
	add(target: AnyTargetClient): void | Promise<void>;
	remove(target: AnyTargetClient): void | Promise<void>;
}
