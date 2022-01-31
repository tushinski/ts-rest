import {initClient} from "../browser-build";
import {moviesAPI} from "./testingDescriptor";

try {
    initClient({
        client: moviesAPI,
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