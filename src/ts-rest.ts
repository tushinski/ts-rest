import {walkObject} from "./utils/walk-object";

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ClientMethod = (...data: any[]) => Promise<any>;
type ResourceDescriptor = { [key: string]: ResourceDescriptor } & {
    get?: ClientMethod,
    getAll?: ClientMethod,
    post?: ClientMethod,
    put?: ClientMethod,
    delete?: ClientMethod,
    single?: (id: string) => object
};
type URLParams = {[key: string]: string | number | boolean | null};
type ClientOptions = {
    url: string,
    descriptor: ResourceDescriptor,
    commonRequestOptions?: FetchOptions
};
type FetchOptions = {
    headers?: {[key: string]: string},
    mode?: string,
    credentials?: string,
    cache?: string,
    redirect?: string,
    referrer?: string,
    referrerPolicy?: string,
    integrity?: string,
    keepalive?: boolean
};
type MappingOptions = {
    method: HTTPMethod,
    descriptorOptions?: ClientOptions
    path?: string,
};
type RequestOptions = {mapping, body?, params?: URLParams, id?: string};


const clientMethodToHttpMethod: {[key: string]: HTTPMethod} = {
    get: 'GET',
    getAll: 'GET',
    post: 'POST',
    put: 'PUT',
    delete: 'DELETE'
};
const mappingToOptions = new Map<Function, MappingOptions>();
const descriptorProviderToPath = new Map<Function, string>();


function encodeUrlParams(params: URLParams) {
    let paramsEncoded = [];
    for (let name in params) {
        paramsEncoded.push(`${name}=${params[name]}`);
    }
    return paramsEncoded.join('&');
}


function request(options: RequestOptions) {
    const mappingOptions = mappingToOptions.get(options.mapping);
    let requestOptions: any = {};
    let requestUrl = mappingOptions.descriptorOptions.url + mappingOptions.path;

    requestOptions.method = mappingOptions.method;
    if (options.body !== undefined) {
        requestOptions.body = JSON.stringify(options.body);
    }
    if (options.id) {
        requestUrl += `/${options.id}`;
    }
    if (options.params) {
        requestUrl += `?${encodeUrlParams(options.params)}`;
    }

    requestOptions = {
        ...requestOptions,
        ...mappingOptions.descriptorOptions.commonRequestOptions
    };

    return fetch(requestUrl, requestOptions)
        .then(res => res.json())
}


function nested<NestedDescriptor extends ResourceDescriptor>(descriptorConstructor: () => NestedDescriptor) {
    const descriptorProvider = function(id: string): NestedDescriptor {
        const basePath = descriptorProviderToPath.get(descriptorProvider);
        const descriptor = descriptorConstructor();
        initClient({
            descriptor,
            url: `${basePath}/${id}`
        });
        return descriptor;
    };
    descriptorProviderToPath.set(descriptorProvider, '');
    return descriptorProvider;
}


function getMapping<ParamsType extends URLParams, ResponseType>() {
    const mapping = function(id?: string, params?: ParamsType): Promise<ResponseType> {
        return request({mapping, id, params})
    };
    mappingToOptions.set(mapping, {method: 'GET'});
    return mapping;
}


function getAllMapping<ParamsType extends URLParams, ResponseType>() {
    const mapping = function(params?: ParamsType): Promise<ResponseType> {
        return request({mapping, params})
    };
    mappingToOptions.set(mapping, {method: 'GET'});
    return mapping;
}


function postMapping<DataType, ResponseType>() {
    const mapping = function(body: DataType): Promise<ResponseType> {
        return request({mapping, body})
    };
    mappingToOptions.set(mapping, {method: 'POST'});
    return mapping;
}


function putMapping<DataType, ResponseType>() {
    const mapping = function(id: string, body: DataType): Promise<ResponseType> {
        return request({mapping, id, body})
    };
    mappingToOptions.set(mapping, {method: 'PUT'});
    return mapping;
}


function deleteMapping<ResponseType>() {
    const mapping = function(id: string): Promise<ResponseType> {
        return request({mapping, id})
    };
    mappingToOptions.set(mapping, {method: 'DELETE'});
    return mapping;
}


function initClient(options: ClientOptions) {
    options = {...options};

    walkObject(options.descriptor, ({ value, location, key, isLeaf }) => {
        if (!isLeaf) return;

        const resourcePath = '/' + location.slice(0, location.length - 1).join('/');

        if (descriptorProviderToPath.has(value)) {
            descriptorProviderToPath.set(value, resourcePath);
            return;
        }

        const mappingOptions = mappingToOptions.get(value);

        if (!mappingOptions) {
            throw new Error(`Invalid mapping for: ${location.join('.')}`);
        }
        if (mappingOptions.method !== clientMethodToHttpMethod[key]) {
            throw new Error(`Method name '${key}' doesn't match to '${mappingOptions.method}' mapping.`);
        }

        mappingOptions.path = resourcePath;
        mappingOptions.descriptorOptions = options;
    });

    Object.freeze(options.descriptor);
}


export { getMapping, getAllMapping, postMapping, putMapping, deleteMapping, initClient };
