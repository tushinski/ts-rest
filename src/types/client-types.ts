import {ModifiersMap} from "./modifiers-types";
import {HTTPMethod} from "./request-types";

type Pojo = {[key: string]: any};

export type RestClient = { [key: string]: Pojo } & {
    get?: RestClientMethod,
    getAll?: RestClientMethod,
    post?: RestClientMethod,
    put?: RestClientMethod,
    delete?: RestClientMethod,
    single?: (id: string) => object
};

export type RestClientMethod = (...data: any[]) => Promise<any>;

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