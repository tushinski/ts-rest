import {deleteMapping, getAllMapping, getMapping, postMapping, putMapping, sub} from "../browser-build/ts-rest.js";

type Genre = { id: number, name: string };
type Movie = { id: number, name: string, genres: number[] };
type Actor = { id: number, fullName: string, movies: number[] };
type Event = { year: string, festival: string };
type Nomination = { festival: string, name: string };

type Response<T> = {
    data: T,
    requestData: {
        url: string,
        body: any,
        testingHeaderValue: string
    }
}

export const moviesAPI = {
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