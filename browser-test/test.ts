import {initClient} from "../browser-build/ts-rest.js";
import {moviesAPI} from "./testingDescriptor";

try {
    initClient({
        descriptor: moviesAPI,
        url: `http://localhost:4000`
    });

    moviesAPI.genres.get('0')
        .then((resp) => {
            if (resp.data.id === 0) {
                console.log('TEST PASSED');
            }
        });
} catch (e) {
    console.error('TEST FAILED\n');
    console.error(e);
}