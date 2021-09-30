import {HTTPMethod, RequestModifiers} from "./request";

type Pojo = {[key: string]: any};

export type ResourceDescriptor = { [key: string]: Pojo } & {
    get?: ClientMethod,
    getAll?: ClientMethod,
    post?: ClientMethod,
    put?: ClientMethod,
    delete?: ClientMethod,
    single?: (id: string) => object
};

export type ClientMethod = (...data: any[]) => Promise<any>;

export type ClientOptions = {
    url: string,
    descriptor: ResourceDescriptor,
    requestModifiers?: RequestModifiers
};

export type MappingOptions = {
    method: HTTPMethod,
    descriptorOptions?: ClientOptions
    path?: string,
};