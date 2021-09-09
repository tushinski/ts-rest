import {getMapping, initClient} from "../build/ts-rest";

const dogApi = {
    breeds: {
        list: {
            all: {
                get: getMapping<undefined, {message: any, status: string}>(),
            }
        }
    }
};

initClient({
    descriptor: dogApi,
    url: `https://dog.ceo/api`
});

dogApi.breeds.list.all.get()
    .then((resp) => console.log({resp}));