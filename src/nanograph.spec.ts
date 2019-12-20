/**
 * This code is licensed under the MIT-License.
 *
 * Author: Tobias Kavšek <tobiaskavsek@hotmail.de>
 */

import { Nanograph } from './';

describe('create entities', () => {

	describe('create vertices', () => {

		test('create a vertex', () => {
			const nano: Nanograph = new Nanograph();
			const vertexCreationResult = nano.createVertex('PERSON', { name: 'John Doe' });

			expect(vertexCreationResult.error).toBeUndefined();
			expect(vertexCreationResult._id).toBeDefined();
			expect(nano.getVertexCount()).toBe(1);
		});

		test('create a vertex multiple properties', () => {
			const nano: Nanograph = new Nanograph();
			const { _id } = nano.createVertex('PERSON', {
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
			const { _id: johnDoeId } = nano.createVertex('PERSON', { name: 'John Doe' });
			const { _id: janeDoeId } = nano.createVertex('PERSON', { name: 'Jane Doe' });
			const { _id: friendshipId } = nano.createEdge('FRIENDSHIP', johnDoeId!, janeDoeId!);

			expect(friendshipId).toBeDefined();
		});

		test('create Edge with properties', () => {
			const nano: Nanograph = new Nanograph();

			const { _id: johnDoeId } = nano.createVertex('PERSON', { name: 'John Doe' });
			const { _id: janeDoeId } = nano.createVertex('PERSON', { name: 'Jane Doe' });
			const { _id: friendshipId } = nano.createEdge('FRIENDSHIP', johnDoeId!, janeDoeId!, {
				since: Date.now(),
				distant: true,
			});

			expect(friendshipId).toBeDefined();
		});

		test('fail on non existing vertices', () => {
			const nano: Nanograph = new Nanograph();

			const johnDoeId = 'PERSON:32';
			const { _id: janeDoeId } = nano.createVertex('PERSON', { name: 'Jane Doe' });
			const { _id: friendshipId, error } = nano.createEdge('FRIENDSHIP', johnDoeId, janeDoeId!, {
				since: Date.now(),
				distant: true,
			});

			expect(friendshipId).toBeUndefined();
			expect(error).toBeDefined();
			expect((error as unknown as Error).message).toBe('ERR_VERTEX_MISSING');
		});

	});

});

describe('retrieve entities', () => {

	describe('retrieve vertex properties', () => {

		test('by id', () => {
			const nano: Nanograph = new Nanograph();
			const { _id } = nano.createVertex('PERSON', { name: 'John Doe' });
			const edge = nano
				.findVertices('PERSON', _id )
				.getFirst();

			expect(edge?.properties?.name).toEqual('John Doe');
		});

		test('by parameter', () => {
			const nano: Nanograph = new Nanograph();
			nano.createVertex('PERSON', { name: 'John Doe' });
			const edges = nano
				.findVertices('PERSON', { name: { equals: 'John Doe' } })
				.getAll();

			expect(edges).toHaveLength(1);
			expect(edges[0].properties?.name).toBe('John Doe');
		});
	});

	describe('retrieve edge properties', () => {

		test('by Id', () => {
			const nano: Nanograph = new Nanograph();
			const { _id: vertex1Id } = nano.createVertex('PERSON', { name: 'John Doe' });
			const { _id: vertex2Id } = nano.createVertex('PERSON', { name: 'Jane Doe' });
			const { _id: edgeId } = nano.createEdge('FRIENDSHIP', vertex1Id!, vertex2Id!, {
				type: 'platonic', since: Date.now(),
			});

			const edge = nano
				.findEdges('FRIENDSHIP', { _id: { equals: edgeId } })
				.getFirst();
		});

		test('by properties', () => {
			const nano: Nanograph = new Nanograph();
			const { _id: vertex1Id } = nano.createVertex('PERSON', { name: 'John Doe' });
			const { _id: vertex2Id } = nano.createVertex('PERSON', { name: 'Jane Doe' });
			const { _id: edgeId } = nano.createEdge('FRIENDSHIP', vertex1Id!, vertex2Id!, {
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
		const nano: Nanograph = new Nanograph();
		const { _id: johnDoeId } = nano.createVertex('PERSON', {
			name: 'John Doe', gender: 'm',
		});
		const { _id: janeDoeId } = nano.createVertex('PERSON', {
			name: 'Jane Doe', gender: 'f',
		});
		const { _id: jamesDoeId } = nano.createVertex('PERSON', {
			name: 'James Doe', gender: 'm',
		});
		const { _id: marthaDoeId } = nano.createVertex('PERSON', {
			name: 'Martha Doe', gender: 'f',
		});
		const { _id: markusDoughId } = nano.createVertex('PERSON', {
			name: 'Markus Dough', gender: 'm',
		});
		const { _id: lindaDoughId } = nano.createVertex('PERSON', {
			name: 'Linda Dough', gender: 'f',
		});
		const { _id: magnussenDoughId } = nano.createVertex('PERSON', {
			name: 'Magnussen Dough', gender: 'm',
		});
		const { _id: luisaDoughId } = nano.createVertex('PERSON', {
			name: 'Luisa Dough', gender: 'f',
		});
		const { _id: sirDoughId } = nano.createVertex('PERSON', {
			name: 'Sir Dough IV', gender: 'm',
		});
		const { _id: isabellaDoughId } = nano.createVertex('PERSON', {
			name: 'Isabella Dough', gender: 'f',
		});

		nano.createEdge('MARRIED', johnDoeId!, janeDoeId!, {
			year: 2014, lasting: true,
		});
		nano.createEdge('MARRIED', jamesDoeId!, marthaDoeId!, {
			year: 1989, lasting: true,
		});
		nano.createEdge('MARRIED', markusDoughId!, lindaDoughId!, {
			year: 1965, lasting: false,
		});
		nano.createEdge('MARRIED', magnussenDoughId!, luisaDoughId!, {
			year: 1931, lasting: false,
		});
		nano.createEdge('MARRIED', sirDoughId!, isabellaDoughId!, {
			year: 1931, lasting: false,
		});

		nano.createEdge('CHILDOF', johnDoeId!, jamesDoeId!);
		nano.createEdge('CHILDOF', johnDoeId!, marthaDoeId!);
		nano.createEdge('CHILDOF', marthaDoeId!, markusDoughId!);
		nano.createEdge('CHILDOF', marthaDoeId!, lindaDoughId!);
		nano.createEdge('CHILDOF', markusDoughId!, magnussenDoughId!);
		nano.createEdge('CHILDOF', markusDoughId!, luisaDoughId!);
		nano.createEdge('CHILDOF', magnussenDoughId!, sirDoughId!);
		nano.createEdge('CHILDOF', magnussenDoughId!, isabellaDoughId!);

		test ('one iteration', () => {
			const vertices = nano
				.findVertices('PERSON', { name: { equals: 'John Doe' } })
				.over('CHILDOF').to('PERSON')
				.getAll();

			expect(vertices).toHaveLength(2);
		});

		test('two iterations', () => {
			const edges = nano
				.findVertices('PERSON', { name: { equals: 'John Doe' } })
				.over('CHILDOF').to('PERSON', { gender: { equals: 'm' } })
				.over('MARRIED').to('PERSON')
				.getAll();

			expect(edges).toHaveLength(1);
		});

		test('three iterations', () => {
			const vertices = nano
				.findVertices('PERSON', { name: { equals: 'John Doe' } })
				.over('CHILDOF').to('PERSON')
				.over('CHILDOF').to('PERSON', { gender: { equals: 'm' } })
				.over('MARRIED').to('PERSON')
				.getAll();

			expect(vertices).toHaveLength(1);
		});

	});

});

describe('delete entities', () => {

	test('remove a vertex', () => {
		const nano = new Nanograph();
		const { _id: johnDoeId } = nano.createVertex('PERSON', { name: 'John Doe' });
		const { _id: janeDoeId } = nano.createVertex('PERSON', { name: 'Jane Doe' });
		const { _id: edgeId } = nano.createEdge('MARRIED', janeDoeId!, johnDoeId!);
		const beforeVertexCount = nano.getVertexCount();
		const beforeEdgeCount = nano.getEdgeCount();
		nano.deleteVertex(johnDoeId!);

		expect(beforeVertexCount).toBe(2);
		expect(beforeEdgeCount).toBe(1);
		expect(nano.getVertexCount()).toBe(1);
		expect(nano.getEdgeCount()).toBe(0);
	});

	test('remove an edge', () => {
		const nano = new Nanograph();
		const { _id: johnDoeId } = nano.createVertex('PERSON', { name: 'John Doe' });
		const { _id: janeDoeId } = nano.createVertex('PERSON', { name: 'Jane Doe' });
		const { _id: edgeId } = nano.createEdge('MARRIED', janeDoeId!, johnDoeId!);
		const getEdgeCount = nano.getEdgeCount();
		nano.deleteEdge(edgeId!);

		expect(getEdgeCount).toBe(1);
		expect(nano.getEdgeCount()).toBe(0);
	});

});

describe('update entities', () => {

	test('update vertices', () => {
		const nano = new Nanograph();
		const { _id } = nano.createVertex('ANIMAL', { name: 'Elephant', weight: 4500 });
		nano.updateVertex(_id!, { weight: 6000, hasFur: false });
		const vertex = nano
			.findVertices('ANIMAL', { name: { equals: 'Elephant' } })
			.getFirst();

		expect(vertex?.properties).toMatchObject({ name: 'Elephant', weight: 6000, hasFur: false });
	});

	test('update edges', () => {
		const nano = new Nanograph();
		const { _id: v1Id } = nano.createVertex('PERSON', { name: 'John Doe' });
		const { _id: v2Id } = nano.createVertex('COMPANY', { name: 'Corp Inc.', state: 'de' });
		const { _id: eId } = nano.createEdge('WORKSAT', v1Id!, v2Id!, { since: 2003, isShareholder: false });
		nano.updateEdge(eId!, { isShareHolder: true, holdings: 15 });
		const edge = nano
			.findEdges('WORKSAT', { since: { equals: 2003 } })
			.getFirst();

		expect(edge?.properties).toMatchObject({ since: 2003, isShareHolder: true, holdings: 15 });
	});

});
