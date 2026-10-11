# Warp Core Network - Idea and Protocol Notes

## Vision

Warp Core Network is a software-defined networking concept focused on protocol-level data relay.

The system is designed to:
- Connect heterogeneous transport mechanisms through a common model.
- Relay channel-based messages in an IRC-like way.
- Expose network topology at runtime (discovery) so nodes can be inspected, including remote/external nodes.
- Support optional encryption and PKI in later phases.

## Core Model (Current Type System)

The current TypeScript interfaces and types define these core entities:

- Conduit: transport adapter with channels, lifecycle, and message events.
- Node: generic network participant (minimal identity contract today).
- Injector: endpoint/component that can be connected into the graph.
- Relay: bridge concept between conduits (currently represented as an interface placeholder).
- Cube Client: control-plane client that connects to a namespace and adds/removes targets.
- Cube Service: control-plane service that lists namespaces and resources by namespace.

## Existing Contracts and Meanings

### Conduit

`IConduit<ConduitType, ConduitDataType>` is the data-plane abstraction.

Capabilities:
- Channel management: register/unregister/list channels.
- Lifecycle: listen/close/status.
- Data path: write(channel, data).
- Events: status change, message(channel, data), error.

Implication:
- A Conduit is the transport-facing primitive where protocol payload enters/leaves.
- Channels are first-class and can represent topics, rooms, streams, or routed subjects.

### Namespace

Namespace is currently the top-level visibility and scoping boundary in the control-plane API:
- `ICubeClient.connect(nameSpace)`
- `ICubeService.listNamespaces()`
- `ICubeService.listConduits(nameSpace)`
- `ICubeService.listInjectors(nameSpace)`
- `ICubeService.listNodes(nameSpace)`

Working interpretation:
- Namespace behaves similarly to an IRC server scope (published realm).
- Channels live inside a namespace and are exposed through participating conduits.

### Channels

Channels are represented as `Set<string>` in conduit info and in conduit APIs.

Current behavior model:
- Producers write to a channel through a conduit.
- Consumers subscribe/listen by channel via conduit-specific mechanisms.
- Multiple listeners may hook to the same channel, enabling pub/sub patterns.

### Cube Service and Cube Client

Control-plane split:
- Cube Client performs connect/add/remove operations.
- Cube Service provides topology/resource listing and conduit lifecycle events.

This split naturally maps to:
- Client side orchestration and registration.
- Service side discovery and observability.

## Relay-Oriented Protocol Direction

The architecture suggests an overlay-style relay network:
- Conduits adapt protocol transports (WebSocket/TCP/QUIC/serial/etc).
- Relays bridge two or more conduits.
- Nodes and injectors provide graph endpoints and attachments.

A generic relay decision path can be:
1. Receive message on ingress conduit and channel.
2. Validate namespace and channel policy.
3. Apply optional crypto envelope policy.
4. Select egress conduits/nodes from routing table.
5. Forward while preserving metadata (origin, hop, timestamp, trace id).

## Discovery Roadmap (Planned)

Goal: full graph visibility, including remote segments.

Planned discovery capabilities:
- Node advertisement with stable identity and capabilities.
- Conduit advertisement with channel map and status.
- Cross-namespace or federated namespace references.
- Remote segment introspection with trust boundaries.

Suggested protocol primitives for discovery:
- HELLO/ANNOUNCE: identity + capabilities.
- STATE: periodic status snapshots.
- TOPOLOGY_DELTA: incremental graph changes.
- QUERY/RESPONSE: on-demand topology lookup.

## Optional Encryption and PKI (Planned)

Security should be optional and composable per namespace/channel.

Recommended progression:
1. No-crypto mode (development/local).
2. Channel-level shared-key encryption profile.
3. Namespace-level PKI profile with cert-based identity.
4. Mutual authentication across relays and federation links.

Policy dimensions to model:
- Encryption mode (`none`, `optional`, `required`).
- Identity mode (`anonymous`, `preshared`, `pki`).
- Trust anchors and certificate rollover.
- Per-channel confidentiality/integrity requirements.

## Suggested Next Type Additions

To align code with the idea, introduce explicit protocol types:
- Namespace descriptor (id, visibility, policy profile).
- Channel descriptor (name, qos, retention, crypto policy).
- Relay descriptor (connected conduits, route rules, trust profile).
- Discovery messages (announce, state, topology delta, query).
- Security profile and PKI material references.

## Notes from Current Scan

All TypeScript files were scanned to build this document.

Observed technical notes:
- Relay interface file currently declares `INode` with `_t: 'relay'`; likely intended to be `IRelay`.
- Some status payload parameter names are generic (`error`) even when value type is status enum.
- Entry-point barrel files are currently empty (`src/index.ts`, `src/interfaces/index.ts`).

These are not blockers for the concept, but clarifying them will improve API readability.

## Summary

Warp Core Network already has a strong base for a protocol-level SDN relay system:
- Namespace-scoped control plane.
- Channel-capable conduit abstraction.
- Event-driven lifecycle and status modeling.

The next phase is making discovery and optional security first-class protocol constructs while keeping the conduit/relay model transport-agnostic.
