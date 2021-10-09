import {initClient} from "../build/ts-rest.js";
import {moviesAPI} from "./testingDescriptor";

try {
    initClient({
        descriptor: moviesAPI,
        url: `http://localhost:4000`
    });

    moviesAPI.genres.get('0')
        .then((resp) => {
            if (resp.data.id === 0) {
                alert('BROWSER TEST PASSED');
            }
        });
} catch (e) {
    alert('TEST FAILED');
    console.error(e);
}