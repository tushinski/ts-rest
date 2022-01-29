import {walkObject} from "./utils/walk-object";
import {URLParams} from "./utils/encode-url-params";
import {request} from "./request";
import {HTTPMethod} from "./types/request-types";
import {MappingOptions, RestClient, RestClientOptions} from "./types/client-types";


const clientMethodToHttpMethod: {[key: string]: HTTPMethod} = {
    get: 'GET',
    getAll: 'GET',
    post: 'POST',
    put: 'PUT',
    delete: 'DELETE'
};
const mappingToOptions = new Map<Function, MappingOptions>();
const descriptorProviderToUrl = new Map<Function, string>();


function sub<NestedDescriptor extends RestClient>(descriptorConstructor: () => NestedDescriptor) {
    const descriptorProvider = function(id: string): NestedDescriptor {
        const basePath = descriptorProviderToUrl.get(descriptorProvider);
        const descriptor = descriptorConstructor();
        initClient({
            descriptor,
            url: `${basePath}/${id}`
        });
        return descriptor;
    };
    descriptorProviderToUrl.set(descriptorProvider, '');
    return descriptorProvider;
}


function getMapping<ParamsType extends URLParams, ResponseType>() {
    const mapping = function(id?: string, params?: ParamsType): Promise<ResponseType> {
        return request({mappingOptions: mappingToOptions.get(mapping), id, params})
    };
    mappingToOptions.set(mapping, {method: 'GET'});
    return mapping;
}


function getAllMapping<ParamsType extends URLParams, ResponseType>() {
    const mapping = function(params?: ParamsType): Promise<ResponseType> {
        return request({mappingOptions: mappingToOptions.get(mapping), params})
    };
    mappingToOptions.set(mapping, {method: 'GET'});
    return mapping;
}


function postMapping<DataType, ResponseType>() {
    const mapping = function(body: DataType): Promise<ResponseType> {
        return request({mappingOptions: mappingToOptions.get(mapping), body})
    };
    mappingToOptions.set(mapping, {method: 'POST'});
    return mapping;
}


function putMapping<DataType, ResponseType>() {
    const mapping = function(id: string, body: DataType): Promise<ResponseType> {
        return request({mappingOptions: mappingToOptions.get(mapping), id, body})
    };
    mappingToOptions.set(mapping, {method: 'PUT'});
    return mapping;
}


function deleteMapping<ResponseType>() {
    const mapping = function(id: string): Promise<ResponseType> {
        return request({mappingOptions: mappingToOptions.get(mapping), id})
    };
    mappingToOptions.set(mapping, {method: 'DELETE'});
    return mapping;
}


function initClient(options: RestClientOptions) {
    options = {...options};

    walkObject(options.descriptor, ({ value, location, key, isLeaf }) => {
        if (!isLeaf) return;

        let resourcePath = location.slice(0, location.length - 1).join('/');
        resourcePath = resourcePath && `/${resourcePath}`;

        if (descriptorProviderToUrl.has(value)) {
            descriptorProviderToUrl.set(value, `${options.url}${resourcePath}`);
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


export { getMapping, getAllMapping, postMapping, putMapping, deleteMapping, sub, initClient };
