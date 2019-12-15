import { Nanograph } from './';

describe('create entities', () => {

	describe('create vertices', () => {

		test('create a vertex', () => {
			const nano: Nanograph = new Nanograph();
			const { id } = nano.create<string>('PERSON', 'John Doe');

			expect(id).toBeDefined();
			expect(nano.meta.getVertexCount()).toBe(1);
		});

		test('create a vertex using interfaces', () => {
			interface IPerson { firstName: string, familyName: string, balance: number };
			const nano: Nanograph = new Nanograph();
			const { id } = nano.create<IPerson>('PERSON', {
				firstName: 'John',
				familyName: 'Doe',
				balance: 42,
			});

			expect(id).toBeDefined();
			expect(nano.meta.getVertexCount()).toBe(1);
		});

	});

	describe('create edges', () => {

		test('create edge', () => {

		});

		test('create Edge with properties', () => {

		});

		test('fail on non existing vertices', () => {

		});

	});

});

describe('retrieve entities', () => {

	describe('retrieve vertex properties', () => {

	});

	describe('retrieve edge properties', () => {

	});

});

describe('remove entities', () => {

});

describe('update entities', () => {

});
