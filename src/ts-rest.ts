import {walkObject} from "./utils/walk-object";
import {URLParams} from "./utils/encode-url-params";
import {HTTPMethod, request} from "./utils/request";
import {ClientOptions, MappingOptions, ResourceDescriptor} from "./common-typings";


const clientMethodToHttpMethod: {[key: string]: HTTPMethod} = {
    get: 'GET',
    getAll: 'GET',
    post: 'POST',
    put: 'PUT',
    delete: 'DELETE'
};
const mappingToOptions = new Map<Function, MappingOptions>();
const descriptorProviderToPath = new Map<Function, string>();


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
