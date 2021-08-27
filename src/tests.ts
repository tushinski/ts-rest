import {getAllMapping, initApi} from "../build/clearest";


const dogApiUrl = `https://dog.ceo/api`;
const dogApi = {
    breeds: {
        list: {
            all: {
                _GET: getAllMapping<undefined, {message: any, status: string}>()
            }
        }
    }
};

initApi(dogApi, dogApiUrl);

dogApi.breeds.list.all._GET()
    .then((resp) => console.log({resp}));