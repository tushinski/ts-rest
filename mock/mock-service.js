/**
 * Simple mock service for testing.
 * Each method tested with Postman.
 */

const express = require('express');
const app = express();
const port = 4000;

app.use(express.json());

/**
 *  MOCK DATA
 */

const genres = [
    { id: 0, name: 'drama' },
    { id: 1, name: 'crime' },
    { id: 2, name: 'mystery' },
    { id: 3, name: 'thriller' },
    { id: 4, name: 'sci-fi' },
    { id: 5, name: 'romance' }
];

const movies = [
    { id: 0, name: 'Pulp Fiction', genres: [0, 1] },
    { id: 1, name: 'The Silence of the Lambs', genres: [0, 1, 3] },
    { id: 2, name: 'American Beauty', genres: [1] },
    { id: 3, name: 'Rain Man', genres: [0] },
    { id: 4, name: 'Twelve Monkeys', genres: [2, 3, 4] },
    { id: 5, name: 'A Bronx Tale', genres: [0, 1, 5] },
    { id: 6, name: 'The Usual Suspects', genres: [1, 2, 3]},
    { id: 7, name: 'K-PAX', genres: [0, 2, 4]}
];

const actors = [
    {
        id: 0,
        name: 'Kevin Spacey',
        movies: [2, 6, 7]
    }
];

const events = [
    {
        year: '1966',
        festival: 'Cinema Festival'
    }
];

const nominations = [
    {
        festival: 'Cinema Festival',
        name: 'Nomination Name'
    }
];

const findMovieById = (id) => movies.find(movie => movie.id === Number(id));

const sendResponse = ({req, res, data}) => {
    const extendedData = {
        data,
        requestData: {
            url: req.originalUrl,
            body: req.body,
            testingHeaderValue: req.get('Testing-header')
        }
    };

    res.send(extendedData);
};

/**
 *  MOVIES MAPPINGS
 */

app.get('/movies', (req, res) => {
    let data;

    if (req.query.genre) {
        data = movies.filter(movie => movie.genres.includes(Number(req.query.genre)));
    } else {
        data = movies;
    }

    sendResponse({req, res, data});
});

app.get('/movies/:id', (req, res) => {
    sendResponse({req, res, data: findMovieById(req.params.id)});
});

app.post('/movies', (req, res) => {
    sendResponse({req, res, data: req.body});
});

app.put('/movies/:id', (req, res) => {
    const movie = findMovieById(req.params.id);

    if (!movie) {
        res.code(400);
        res.send();
    }

    sendResponse({
        req, res,
        data: {...movie, ...req.body}
    });
});

app.delete('/movies/:id', (req, res) => {
    sendResponse({
        req, res,
        data: {success: !!findMovieById(req.params.id)}
    });
});

/**
 *  GENRES MAPPINGS
 */
app.get('/genres', (req, res) => {
    sendResponse({req, res, data: genres});
});

app.get('/genres/:id', (req, res) => {
    sendResponse({
        req, res,
        data: genres.find(genre => genre.id === Number(req.params.id))
    });
});

/**
 * ACTORS
 */

app.get('/actors', (req, res) => {
    sendResponse({req, res, data: actors});
});

app.get('/actors/:id/movies', (req, res) => {
    const actor = actors.find(actor => actor.id === Number(req.params.id));
    const actorMovies = movies.filter(movie => actor.movies.includes(movie.id));

    sendResponse({req, res, data: actorMovies});
});


/**
 * PATHS WITH MULTIPLE PATH PARAMETERS
 */

app.get('/festivals/:festival/:year', (req, res) => {
    sendResponse({
        req, res,
        data: events.find(event => event.festival === req.params.festival && event.year === req.params.year)
    });
});

app.get('/festivals/:festival/nominations/:nomination', (req, res) => {
    sendResponse({
        req, res,
        data: nominations.find(nomination => {
            return nomination.festival === req.params.festival &&
                nomination.name === req.params.nomination;
        })
    });
});


app.listen(port, () => {
    console.log(`Mock service listening at http://localhost:${port}`);
});