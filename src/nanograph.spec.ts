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
				.getFirst();

			expect(edge?.properties?.name).toEqual('John Doe')
		});

		test('by parameter', () => {
			const nano: Nanograph = new Nanograph();
			nano.createVertex<string>('PERSON', 'John Doe');
			const edges = nano
				.findVertices('PERSON', { name: { equals: 'John Doe' } })
				.getAll();

			expect(edges).toHaveLength(1);
			expect(edges[0]?.properties?.name).toBe('John Doe');
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
				.getAll();

			expect(edges).toHaveLength(1);
			expect(edges[0]._id).toBe(edgeId);
		});

	});

	describe('traversal', () => {
		interface IPerson {
			name: string;
			gender: 'm' | 'f';
		}
		interface IMarriage {
			year: number,
			lasting: boolean,
		}

		const nano: Nanograph = new Nanograph();
		const { _id: johnDoeId } = nano.createVertex<IPerson>('PERSON', {
			name: 'John Doe', gender: 'm',
		});
		const { _id: janeDoeId } = nano.createVertex<IPerson>('PERSON', {
			name: 'Jane Doe', gender: 'f',
		});
		const { _id: jamesDoeId } = nano.createVertex<IPerson>('PERSON', {
			name: 'James Doe', gender: 'm',
		});
		const { _id: marthaDoeId } = nano.createVertex<IPerson>('PERSON', {
			name: 'Martha Doe', gender: 'f',
		});
		const { _id: markusDoughId } = nano.createVertex<IPerson>('PERSON', {
			name: 'Markus Dough', gender: 'm',
		});
		const { _id: lindaDoughId } = nano.createVertex<IPerson>('PERSON', {
			name: 'Linda Dough', gender: 'f',
		});
		const { _id: magnussenDoughId } = nano.createVertex<IPerson>('PERSON', {
			name: 'Magnussen Dough', gender: 'm',
		});
		const { _id: luisaDoughId } = nano.createVertex<IPerson>('PERSON', {
			name: 'Luisa Dough', gender: 'f',
		});
		const { _id: sirDoughId } = nano.createVertex<IPerson>('PERSON', {
			name: 'Sir Dough IV', gender: 'm',
		});
		const { _id: isabellaDoughId } = nano.createVertex<IPerson>('PERSON', {
			name: 'Isabella Dough', gender: 'f',
		});

		nano.createEdge<IMarriage>('MARRIED', johnDoeId, janeDoeId, {
			year: 2014, lasting: true,
		});
		nano.createEdge<IMarriage>('MARRIED', jamesDoeId, marthaDoeId, {
			year: 1989, lasting: true,
		});
		nano.createEdge<IMarriage>('MARRIED', markusDoughId, lindaDoughId, {
			year: 1965, lasting: false,
		});
		nano.createEdge<IMarriage>('MARRIED', magnussenDoughId, luisaDoughId, {
			year: 1931, lasting: false,
		});
		nano.createEdge<IMarriage>('MARRIED', sirDoughId, isabellaDoughId, {
			year: 1931, lasting: false,
		});

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
