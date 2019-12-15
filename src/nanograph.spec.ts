import { Nanograph } from './';

describe('create entities', () => {

	describe('create vertices', () => {

		test('create a vertex', () => {
			const nano: Nanograph = new Nanograph();
			const { id } = nano.createVertex<string>('PERSON', 'John Doe');

			expect(id).toBeDefined();
			expect(nano.getVertexCount()).toBe(1);
		});

		test('create a vertex using interfaces', () => {
			interface IPerson { firstName: string, familyName: string, balance: number };
			const nano: Nanograph = new Nanograph();
			const { id } = nano.createVertex<IPerson>('PERSON', {
				firstName: 'John',
				familyName: 'Doe',
				balance: 42,
			});

			expect(id).toBeDefined();
			expect(nano.getVertexCount()).toBe(1);
		});

	});

	describe('create edges', () => {

		test('create edge', () => {
			const nano: Nanograph = new Nanograph();
			const { id: johnDoeId } = nano.createVertex<string>('PERSON', 'John Doe');
			const { id: janeDoeId } = nano.createVertex<string>('PERSON', 'Jane Doe');
			const { id: friendshipId } = nano.createEdge('FRIENDSHIP', johnDoeId, janeDoeId);

			expect(friendshipId).toBeDefined();
		});

		test('create Edge with properties', () => {
			const nano: Nanograph = new Nanograph();
			interface IFriendship {since: number, distant: boolean}

			const { id: johnDoeId } = nano.createVertex<string>('PERSON', 'John Doe');
			const { id: janeDoeId } = nano.createVertex<string>('PERSON', 'Jane Doe');
			const { id: friendshipId } = nano.createEdge<IFriendship>('FRIENDSHIP', johnDoeId, janeDoeId, {
				since: Date.now(),
				distant: true,
			});

			expect(friendshipId).toBeDefined();
		});

		test('fail on non existing vertices', () => {
			const nano: Nanograph = new Nanograph();
			interface IFriendship {since: number, distant: boolean}

			const johnDoeId = 'PERSON:32';
			const { id: janeDoeId } = nano.createVertex<string>('PERSON', 'Jane Doe');
			const { id: friendshipId, error } = nano.createEdge<IFriendship>('FRIENDSHIP', johnDoeId, janeDoeId, {
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
			const { id } = nano.createVertex<string>('PERSON', 'John Doe');
			const name: string = nano.findVertexById('PERSON', id);

			expect(name).toBe('John Doe');
		});

		test('by parameter', () => {
			const nano: Nanograph = new Nanograph();
			nano.createVertex<string>('PERSON', 'John Doe');
			const name: string[] = nano.findVertexByProperties('PERSON', { name: { equals: 'John Doe' } });

			expect(name).toBe('John Doe');
		});
	});

	describe('retrieve edge properties', () => {

		test('by Id', () => {

		});

		test('by properties', () => {

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
