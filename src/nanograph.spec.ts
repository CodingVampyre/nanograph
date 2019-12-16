import { Nanograph } from './';

describe('create entities', () => {

	describe('create vertices', () => {

		test('create a vertex', () => {
			const nano: Nanograph = new Nanograph();
			const { _id } = nano.createVertex<string>('PERSON', 'John Doe');

			expect(_id).toBeDefined();
			expect(nano.getVertexCount()).toBe(1);
		});

		test('create a vertex using interfaces', () => {
			interface IPerson { firstName: string, familyName: string, balance: number };
			const nano: Nanograph = new Nanograph();
			const { _id } = nano.createVertex<IPerson>('PERSON', {
				firstName: 'John',
				familyName: 'Doe',
				balance: 42,
			});

			expect(_id).toBeDefined();
			expect(nano.getVertexCount()).toBe(1);
		});

	});

	describe('create edges', () => {

		test('create edge', () => {
			const nano: Nanograph = new Nanograph();
			const { _id: johnDoeId } = nano.createVertex<string>('PERSON', 'John Doe');
			const { _id: janeDoeId } = nano.createVertex<string>('PERSON', 'Jane Doe');
			const { _id: friendshipId } = nano.createEdge('FRIENDSHIP', johnDoeId, janeDoeId);

			expect(friendshipId).toBeDefined();
		});

		test('create Edge with properties', () => {
			const nano: Nanograph = new Nanograph();
			interface IFriendship {since: number, distant: boolean}

			const { _id: johnDoeId } = nano.createVertex<string>('PERSON', 'John Doe');
			const { _id: janeDoeId } = nano.createVertex<string>('PERSON', 'Jane Doe');
			const { _id: friendshipId } = nano.createEdge<IFriendship>('FRIENDSHIP', johnDoeId, janeDoeId, {
				since: Date.now(),
				distant: true,
			});

			expect(friendshipId).toBeDefined();
		});

		test('fail on non existing vertices', () => {
			const nano: Nanograph = new Nanograph();
			interface IFriendship {since: number, distant: boolean}

			const johnDoeId = 'PERSON:32';
			const { _id: janeDoeId } = nano.createVertex<string>('PERSON', 'Jane Doe');
			const { _id: friendshipId, error } = nano.createEdge<IFriendship>('FRIENDSHIP', johnDoeId, janeDoeId, {
				since: Date.now(),
				distant: true,
			});

			expect(friendshipId).toBeUndefined();
			expect(error).toBeDefined();
			expect((error as unknown as Error).message).toBe('ERR_VERTEX_NOT_FOUND');
		});

	});

});

describe('retrieve entities', () => {

	describe('retrieve vertex properties', () => {

		test('by id', () => {
			const nano: Nanograph = new Nanograph();
			const { _id } = nano.createVertex<string>('PERSON', 'John Doe');
			const edge = nano
				.findVertices('PERSON', { _id: { equals: {_id} } })
				.as('persons')
				.getFirst();

			expect(edge?.properties?.name).toEqual('John Doe')
		});

		test('by parameter', () => {
			const nano: Nanograph = new Nanograph();
			nano.createVertex<string>('PERSON', 'John Doe');
			const edges = nano
				.findVertices('PERSON', { name: { equals: 'John Doe' } })
				.as('persons')
				.getAll('persons');

			expect(edges.persons).toHaveLength(1);
			expect(edges[0]?.persons.properties?.name).toBe('John Doe');
		});
	});

	describe('retrieve edge properties', () => {

		test('by Id', () => {
			const nano: Nanograph = new Nanograph();
			const { _id: vertex1Id } = nano.createVertex<string>('PERSON', 'John Doe');
			const { _id: vertex2Id } = nano.createVertex<string>('PERSON', 'Jane Doe');
			const { _id: edgeId } = nano.createEdge<{type: string, since: number}>('FRIENDSHIP', vertex1Id, vertex2Id, {
				type: 'platonic', since: Date.now(),
			});

			const edge = nano
				.findEdges('FRIENDSHIP', { _id: { equals: edgeId } })
				.getFirst();
		});

		test('by properties', () => {
			const nano: Nanograph = new Nanograph();
			const { _id: vertex1Id } = nano.createVertex<string>('PERSON', 'John Doe');
			const { _id: vertex2Id } = nano.createVertex<string>('PERSON', 'Jane Doe');
			const { _id: edgeId } = nano.createEdge<{type: string, since: number}>('FRIENDSHIP', vertex1Id, vertex2Id, {
				type: 'platonic', since: Date.now(),
			});

			const edges = nano
				.findEdges('FRIENDSHIP', { type: { equals: 'platonic' } })
				.as('friendships')
				.getAll('friendships');

			expect(edges.friendships).toHaveLength(1);
			expect(edges.friendships[0]._id).toBe(edgeId);
		});

	});

	describe('traversal', () => {

		test ('one iteration', () => {

		});

		test('two iterations', () => {

		});

		test('three iterations', () => {

		});

	})

});

describe('remove entities', () => {

});

describe('update entities', () => {

});
