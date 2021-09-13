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

initClient({
    descriptor: dogApi,
    url: `https://dog.ceo/api`
});

const hound = dogApi.breed.single('hound');

hound.list.getAll()
    .then((resp) => {
        const firstSubBreed = resp.message[0];
        return hound.single(firstSubBreed).images.getAll();
    })
    .then((resp) => console.log(resp));