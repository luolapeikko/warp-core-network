export const ConduitStatus = {
	INIT: 'init',
	OPENING: 'opening',
	OPEN: 'open',
	CLOSING: 'closing',
	CLOSED: 'closed',
	DESTROYED: 'destroyed',
} as const;
export type ConduitStatus = (typeof ConduitStatus)[keyof typeof ConduitStatus];
