import {walkObject} from "./utils/walk-object";

type MethodName = 'GET' | '_GET' | 'POST' | 'PUT' | 'DELETE';
type ResourceDescriptor = { [key: string]: ResourceDescriptor | ((data: any) => Promise<any>) };
type URLParams = {[key: string]: string | number | boolean | null};
type ApiOptions = {
    commonRequestOptions?: ExtendedRequestOptions
};
type ExtendedRequestOptions = {
    // method?: string,
    headers?: {[key: string]: string},
    // body?: any,
    mode?: string,
    credentials?: string,
    cache?: string,
    redirect?: string,
    referref?: string,
    referrerPolicy?: string,
    integrity?: string,
    keepalive?: boolean
};
type MappingOptions = {
    method: MethodName,
    apiOptions?: ApiOptions
    url?: string,
};


const mappingToOptions = new Map<Function, MappingOptions>();


function encodeUrlParams(params: URLParams) {
    let paramsEncoded = [];
    for (let name in params) {
        if (!['number', 'string', 'boolean', 'null'].includes(typeof params[name])) {
            throw new Error(`Illegal parameter type: parameter: '${params[name]}'; type: '${typeof params[name]}.`);
        }
        paramsEncoded.push(`${name}=${params[name]}`);
    }
    return paramsEncoded.join('&');
}


function request(options: {mapping, body?, params?: URLParams, id?: string}) {
    const mappingOptions = mappingToOptions.get(options.mapping);
    let requestOptions: any = {};
    let requestUrl = mappingOptions.url;

    if (mappingOptions.method[0] === '_') {
        requestOptions.method = mappingOptions.method.substr(1);
    } else {
        requestOptions.method = mappingOptions.method;
    }
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
        ...mappingOptions.apiOptions.commonRequestOptions
    };

    return fetch(requestUrl, requestOptions)
        .then(res => res.json())
}


function getMapping<ParamsType extends URLParams, ResponseType>() {
    const mapping = function(id: string, params?: ParamsType): Promise<ResponseType> {
        return request({mapping, id, params})
    };
    mappingToOptions.set(mapping, {method: 'GET'});
    return mapping;
}


function getAllMapping<ParamsType extends URLParams, ResponseType>() {
    const mapping = function(params?: ParamsType): Promise<ResponseType> {
        return request({mapping, params})
    };
    mappingToOptions.set(mapping, {method: '_GET'});
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


function initApi(descriptor: ResourceDescriptor, url: string, options?: ApiOptions) {
    options = {...options};

    walkObject(descriptor, ({ value, location, key, isLeaf }) => {
        if (!isLeaf) return;

        const mappingOptions = mappingToOptions.get(value);
        const resourcePath = '/' + location.slice(0, location.length - 1).join('/');

        if (!mappingOptions) {
            throw new Error(`Invalid mapping for: ${location.join('.')}`);
        }
        if (mappingOptions.method !== key) {
            throw new Error(`Property name '${key}' doesn't match mapping method: '${mappingOptions.method}'.`);
        }

        mappingOptions.url = url + resourcePath;
        mappingOptions.apiOptions = options;
    });
}


export { getMapping, getAllMapping, postMapping, putMapping, deleteMapping, initApi };
