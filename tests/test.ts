import {deleteMapping, getAllMapping, getMapping, initClient, postMapping, putMapping, sub} from "../src/ts-rest";

type Genre = { id: number, name: string };
type Movie = { id: number, name: string, genres: number[] };
type Actor = { id: number, fullName: string, movies: number[] };
type Event = { year: string, festival: string };
type Nomination = { festival: string, name: string };

type Response<T> = {
    data: T,
    requestData: {
        url: string,
        body: any
    }
}

const moviesAPI = {
    movies: {
        getAll: getAllMapping<{genre?: number}, Response<Movie[]>>(),
        get: getMapping<undefined, Response<Movie>>(),
        post: postMapping<Movie, Response<Movie>>(),
        put: putMapping<Movie, Response<Movie>>(),
        delete: deleteMapping<Response<{success: boolean}>>()
    },
    genres: {
        getAll: getAllMapping<undefined, Response<Genre[]>>(),
        get: getMapping<undefined, Response<Genre>>()
    },
    actors: {
        getAll: getAllMapping<undefined, Response<Actor[]>>(),
        single: sub(() => ({
            movies: {
                getAll: getAllMapping<undefined, Response<Movie[]>>()
            }
        }))
    },
    festivals: {
        single: sub(() => ({
            nominations: {
                get: getMapping<undefined, Response<Nomination>>()
            },
            get: getMapping<undefined, Response<Event>>()
        }))
    }
};

beforeAll(() => {
    initClient({
        descriptor: moviesAPI,
        url: `http://localhost:4000`
    });
});

test('get', () => {
    return moviesAPI.genres.get('0')
        .then((resp) => {
            expect(resp.data.id).toBe(0);
        })
});

test('getAll', () => {
    return moviesAPI.movies.getAll()
        .then((resp) => {
            expect(resp.data).toBeInstanceOf(Array);
        })
});

test('getAll with query params', () => {
    return moviesAPI.movies.getAll({genre: 0})
        .then((resp) => {
            expect(resp.data).toBeInstanceOf(Array);
        })
});

test('put', () => {
    const newMovieName = 'Some name';
    const newMovieData = { id: 0, name: newMovieName, genres: [0, 1, 2] };
    return moviesAPI.movies.put('0', newMovieData)
        .then((resp) => {
            expect(resp.data.name).toBe(newMovieName);
        })
});

test('post', () => {
    const newMovieName = 'Some name';
    const newMovieData = { id: 13, name: newMovieName, genres: [0, 1, 2] };
    return moviesAPI.movies.post(newMovieData)
        .then((resp) => {
            expect(resp.data.name).toBe(newMovieName);
        })
});

test('delete', () => {
    return moviesAPI.movies.delete('0')
        .then((resp) => {
            expect(resp.data.success).toBe(true);
        })
});

test('single.getAll', () => {
    return moviesAPI.actors.single('0').movies.getAll()
        .then((resp) => {
            expect(resp.data).toBeInstanceOf(Array);
        })

});

test('single.subresource.get', () => {
    const nominationName = 'Nomination Name';
    return moviesAPI.festivals.single('Cinema Festival').nominations.get(nominationName)
        .then((resp) => {
            expect(resp.data.name).toBe(nominationName);
        })
});

test('single.get', () => {
    const eventYear = '1966';
    return moviesAPI.festivals.single('Cinema Festival').get(eventYear)
        .then((resp) => {
            expect(resp.data.year).toBe(eventYear);
        })
});