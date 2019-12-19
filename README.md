# Nanograph
Minimalistic in-memory graph for metadata management.
Allows to create directions graphs to store entities and connect them.
Connections, called "edges" may also contain data.

## Installation
Just run `npm i nanograph`.
Types for Typescript are provided and must not be installed separately.

## Usage

### Initialisation
```typescript
import { Nanograph } from 'nanograph';

const nano: Nanograph = new Nanograph();
```

### Insert vertices and edges
```typescript
const { _id: vertex1Id, error: error1 } = nano.createVertex('PERSON', { name: 'John Doe' });
const { _id: vertex2Id, error: error2 } = nano.createVertex('PERSON', { name: 'Jane Doe' });

const { _id: friendshipId } = nano.createEdge('FRIENDSHIP', vertex1Id, vertex2Id, {
    type: 'platonic', since: Date.now(),
});
```

### Retrieve vertices and edges
Retrieve the first edge matching provided criteria.
If an ID is given, it can simply be passed as string.
```typescript
const vertex = nano.findVertices('PERSON', vertex1Id ).getFirst();			
const edge = nano.findEdges('FRIENDSHIP', { _id: { equals: friendshipId } }).getFirst();
```

For filtering, instead of an id, parameters can be provided.
For this version, only equals is possible.
Result of getAll is a list of vertices or edges
```typescript
const vertex = nano.findVertices('PERSON', { name: { equals: 'John Doe' } }).getAll();
const edges = nano.findEdges('FRIENDSHIP', { type: { equals: 'platonic' } }).getAll();
```

Traversal is also possible using labels and properties to filter
```typescript
const vertices = nano
    .findVertices('PERSON', { name: { equals: 'John Doe' } }) // a person called John Doe
    .over('CHILDOF').to('PERSON') // searching for John Does Parents
    .over('CHILDOF').to('PERSON', { gender: { equals: 'm' } }) // searching for their father, John Doe's grandfather
    .over('MARRIED').to('PERSON') // searching for his wife, John Doe's grandmother
    .getAll();
```
