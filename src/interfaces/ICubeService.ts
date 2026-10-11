import type {EventEmitter} from 'events';
import type {CubeConduitInfo} from '../types/cube/CubeConduitInfo';
import type {CubeInjectorInfo} from '../types/cube/CubeInjectorInfo';
import type {CubeNodeInfo} from '../types/cube/CubeNodeInfo';
import type {CubeServiceEvents} from '../types/cube/CubeServiceEvents';

export interface ICubeService<ConduitType extends string = string> extends EventEmitter<CubeServiceEvents> {
	listConduits(nameSpace: string): Set<CubeConduitInfo<ConduitType>> | Promise<Set<CubeConduitInfo<ConduitType>>>;
	listNamespaces(): Set<string> | Promise<Set<string>>;
	listInjectors(nameSpace: string): Set<CubeInjectorInfo> | Promise<Set<CubeInjectorInfo>>;
	listNodes(nameSpace: string): Set<CubeNodeInfo> | Promise<Set<CubeNodeInfo>>;
}
