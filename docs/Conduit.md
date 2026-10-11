# Conduit Draft

## Purpose

Conduit is a point-to-point binary pipe.

Key idea:
- A Conduit does not care if transport is TCP, UDP, WebSocket, WebRTC, QUIC, or something else.
- If bytes can be pushed and received, it can be a Conduit transport.

## Ground Rules

- Conduit is always 1:1 at transport level (one link between two endpoints).
- Client and Server always connect through some Conduit.
- Relay extends Conduit behavior by connecting multiple conduits together.
- Relay can fan-out one inbound packet to many outbound conduits.
- Relay must prevent duplicate handling/forwarding of the same packet.

## Minimal Concepts

- Endpoint: client or server process.
- Conduit: transport adapter carrying binary frames.
- Relay: forwarding engine that attaches to multiple conduits.
- Packet: immutable unit of transfer with identity metadata.
- Route target: where packet can be forwarded next.

## Draft Types (Editable)

```ts
export type ConduitType =
  | 'tcp'
  | 'udp'
  | 'websocket'
  | 'webrtc'
  | 'quic'
  | (string & {});

export type EndpointRole = 'client' | 'server' | 'relay';

export type ConduitId = string;
export type PacketId = string;
export type NamespaceId = string;
export type ChannelId = string;

export interface PacketMeta {
  packetId: PacketId;
  namespace: NamespaceId;
  channel: ChannelId;
  createdAtUnixMs: number;
  sourceConduitId: ConduitId;
  sourceNodeId?: string;
  ttlHops?: number;
  traceId?: string;
}

export interface PacketFrame {
  meta: PacketMeta;
  payload: Uint8Array;
}
```

## Conduit Contract (Concept)

```ts
export interface Conduit {
  id: ConduitId;
  type: ConduitType;
  role: EndpointRole;

  open(): Promise<void>;
  close(): Promise<void>;

  send(frame: PacketFrame): Promise<void>;
  onFrame(handler: (frame: PacketFrame) => void): void;
  onError(handler: (err: Error) => void): void;
}
```

Notes:
- Payload is binary (`Uint8Array`).
- Namespace and channel travel in packet metadata.
- TTL is optional for loop prevention in relay chains.

## Relay Contract (Concept)

```ts
export interface Relay {
  id: string;

  attach(conduit: Conduit): Promise<void>;
  detach(conduitId: ConduitId): Promise<void>;

  listConduits(): ConduitId[];

  // Called when a frame arrives from one conduit.
  handleInbound(frame: PacketFrame, ingressConduitId: ConduitId): Promise<void>;
}
```

Expected behavior:
- Determine egress conduits from route rules.
- Forward to many conduits in parallel when needed.
- Never forward back to ingress conduit unless explicitly configured.
- Do not process/forward the same packet more than once.

## Relay Fan-Out and De-Dup

### Why de-dup is needed

When one inbound stream is replicated to multiple conduits (for example TCP and WebRTC at the same time), copies of the same packet can re-enter the relay graph through different paths.

Without de-dup:
- repeated delivery,
- loops,
- unnecessary bandwidth usage.

### Simple de-dup model

```ts
export interface SeenPacketStore {
  has(packetId: PacketId): boolean;
  markSeen(packetId: PacketId, expiresAtUnixMs: number): void;
  sweep(nowUnixMs: number): void;
}
```

Relay logic (high level):
1. Read `packetId`.
2. If already seen, drop.
3. Mark as seen with short TTL window.
4. Decrement hop TTL (if present), drop at 0.
5. Forward to selected egress conduits.

## Route Selection (Minimal)

```ts
export interface RouteRule {
  namespace?: NamespaceId;
  channel?: ChannelId;
  toConduitIds: ConduitId[];
}

export interface RelayRoutingTable {
  rules: RouteRule[];
}
```

Default strategy:
- Match by namespace + channel.
- Fall back to namespace-only rules.
- Optional catch-all rule.

## Client/Server Attachment Model

- Client attaches to one or more local conduits.
- Server attaches to one or more local conduits.
- Relay may sit between client and server, or between relay segments.
- Every message path is still conduit-based.

Minimal attachment view:

```ts
export interface NodeAttachment {
  nodeId: string;
  role: 'client' | 'server';
  conduitIds: ConduitId[];
}
```

## Open Decisions

- Packet identity format: UUIDv7, ULID, hash-based, or transport-provided id.
- Ordering guarantees per conduit: none, best-effort, strict per channel.
- Delivery semantics: at-most-once vs at-least-once.
- Backpressure handling when one egress conduit is slow.
- Encryption placement: inside payload envelope vs transport-native TLS/DTLS.

## First Implementation Slice

- Implement one `tcp` conduit with binary frame send/receive.
- Implement one in-memory relay with fan-out to N conduits.
- Add packet id + seen-store de-dup.
- Add namespace/channel route rules.
- Add test for duplicate prevention across two egress paths.
