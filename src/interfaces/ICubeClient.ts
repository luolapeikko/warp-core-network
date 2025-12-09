import TypedEmitter from 'typed-emitter';
import {CubeClientEvents} from '../types/cube/CubeClientEvents';
import {IConduit} from './IConduit';
import {INode} from './INode';
import {IInjector} from './IInjector';

type AnyTargetClient = IConduit<string, unknown> | INode | IInjector;

export interface ICubeClient extends TypedEmitter<CubeClientEvents> {
	connect(nameSpace: string): void | Promise<void>;
	add(target: AnyTargetClient): void | Promise<void>;
	remove(target: AnyTargetClient): void | Promise<void>;
}
