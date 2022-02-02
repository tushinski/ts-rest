import {ModifiersMap} from "./modifiers-types";
import {HTTPMethod} from "./request-types";
import {deleteMapping, getAllMapping, getMapping, postMapping, putMapping} from "../ts-rest";

type Pojo = {[key: string]: any};

export type RestClient = { [key: string]: Pojo } & {
    get?: RestClientMethod,
    getAll?: RestClientMethod,
    post?: RestClientMethod,
    put?: RestClientMethod,
    delete?: RestClientMethod,
    single?: (id: string) => object
};

export type RestClientMethod = ReturnType<typeof getMapping> |
    ReturnType<typeof getAllMapping> |
    ReturnType<typeof postMapping> |
    ReturnType<typeof putMapping> |
    ReturnType<typeof deleteMapping>;

export type RestClientOptions = {
    url: string,
    client: RestClient,
    requestModifiers?: ModifiersMap
};

export type MappingOptions = {
    method: HTTPMethod,
    descriptorOptions?: RestClientOptions
    path?: string,
};