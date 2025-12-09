import TypedEmitter from 'typed-emitter';
import {CubeServiceEvents} from '../types/cube/CubeServiceEvents';
import {CubeConduitInfo} from '../types/cube/CubeConduitInfo';
import {CubeInjectorInfo} from '../types/cube/CubeInjectorInfo';
import {CubeNodeInfo} from '../types/cube/CubeNodeInfo';

export interface ICubeService<ConduitType extends string = string> extends TypedEmitter<CubeServiceEvents> {
	listConduits(nameSpace: string): Set<CubeConduitInfo<ConduitType>> | Promise<Set<CubeConduitInfo<ConduitType>>>;
	listNamespaces(): Set<string> | Promise<Set<string>>;
	listInjectors(nameSpace: string): Set<CubeInjectorInfo> | Promise<Set<CubeInjectorInfo>>;
	listNodes(nameSpace: string): Set<CubeNodeInfo> | Promise<Set<CubeNodeInfo>>;
}
