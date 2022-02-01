import {initClient} from "../node-build";
import {moviesAPI} from "./testingDescriptor";


describe('Requests', () => {
    beforeAll(() => {
        initClient({
            client: moviesAPI,
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
        return moviesAPI.festivals.single('/Cinema Festival').get(eventYear)
            .then((resp) => {
                expect(resp.data.year).toBe(eventYear);
            })
    });

    test('subpath.get', () => {
        return moviesAPI.documents.posters("path/to/poster/name.png").get()
            .then((resp) => {
                expect(typeof resp.data.size).toBe("number");
            })
    });

    test('subpath with wrong path', () => {
        const getIncorrectNestedClient = () => moviesAPI.documents.posters("path/to/poster/name.pdf");

        expect(getIncorrectNestedClient).toThrowError();
    });
});

describe('Request modifiers', () => {
    beforeAll(() => {
        initClient({
            client: moviesAPI,
            url: `http://localhost:4000`,
            requestModifiers: {
                optionsModifier: (defaultOptions) => {
                    defaultOptions.headers['Testing-header'] = 'testing-header-value';
                    return defaultOptions;
                },
                bodyModifier: (body) => {
                    body.name = 'modified name';
                    return JSON.stringify(body)
                },
                responseModifier: (resp) => {
                    return resp.json()
                        .then(resp => {
                            resp.data.id = 33;
                            return resp;
                        })
                }
            },
        });
    });

    test('modifiers + get', () => {
        return moviesAPI.movies.post({ id: 0, name: 'name', genres: []})
            .then((resp) => {
                expect(resp.data.name).toBe('modified name');
                expect(resp.data.id).toBe(33);
                expect(resp.requestData.testingHeaderValue).toBe('testing-header-value');
            })
    });
});