import {HTTPMethod} from "./utils/request";

export type ResourceDescriptor = { [key: string]: ResourceDescriptor } & {
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
    descriptor: ResourceDescriptor
};

export type MappingOptions = {
    method: HTTPMethod,
    descriptorOptions?: ClientOptions
    path?: string,
};