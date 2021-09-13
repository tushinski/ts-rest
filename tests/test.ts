import {getAllMapping, initClient, sub} from "../src/ts-rest";

const dogApi = {
    breeds: {
        list: {
            all: {
                getAll: getAllMapping<undefined, {message: any, status: string}>(),
            }
        }
    },
    breed: {
        single: sub(() => ({
            list: {
                getAll: getAllMapping<undefined, {message, status}>()
            },
            single: sub(() => ({
                images: {
                    getAll: getAllMapping<undefined, {message, status}>()
                }
            }))
        }))
    }
};

beforeAll(() => {
    initClient({
        descriptor: dogApi,
        url: `https://dog.ceo/api`
    });
});

test('getAll', () => {
    return dogApi
        .breeds
        .list
        .all
        .getAll()
        .then(resp => {
            expect(resp.status).toBe('success');
            expect(resp.message).toBeTruthy();
        })
});

test('single.getAll', () => {
    return dogApi
        .breed
        .single('hound')
        .list
        .getAll()
        .then((resp) => {
            expect(resp.status).toBe('success');
            expect(resp.message).toBeInstanceOf(Array);
        })

});

test('single.single.getAll (single chain)', () => {
    return dogApi
        .breed
        .single('hound')
        .single('afghan')
        .images
        .getAll()
        .then((resp) => {
            expect(resp.status).toBe('success');
            expect(resp.message).toBeInstanceOf(Array);
        })

});

test('single.single.getAll (two calls)', () => {
    const hound = dogApi.breed.single('hound');

    return hound.list.getAll()
        .then((resp) => {
            expect(resp.status).toBe('success');
            expect(resp.message).toBeInstanceOf(Array);

            const firstSubBreed = resp.message[0];
            expect(firstSubBreed).not.toBeFalsy();

            return hound.single(firstSubBreed).images.getAll();
        })
        .then((resp) => {
            expect(resp.status).toBe('success');
            expect(resp.message).toBeInstanceOf(Array);
        });
});