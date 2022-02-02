import {ModifiersMap} from "./modifiers-types";
import {HTTPMethod} from "./request-types";
import {deleteMapping, getAllMapping, getMapping, postMapping, putMapping} from "../ts-rest";

type Pojo = {[key: string]: any};

export type RestClient = { [key: string]: Pojo };

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