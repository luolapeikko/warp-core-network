export const CubeClientStatus = {
	INIT: 'init',
	CONNECTING: 'connecting',
	CONNECTED: 'connected',
} as const;
export type CubeClientStatus = (typeof CubeClientStatus)[keyof typeof CubeClientStatus];
