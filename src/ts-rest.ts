import {walkObject} from "./utils/walk-object";
import {URLParams} from "./utils/encode-url-params";
import {request} from "./request";
import {HTTPMethod} from "./types/request-types";
import {MappingOptions, RestClient, RestClientOptions} from "./types/client-types";
const urlJoin = require("url-join");

const clientMethodToHttpMethod: {[key: string]: HTTPMethod} = {
    get: 'GET',
    getAll: 'GET',
    post: 'POST',
    put: 'PUT',
    delete: 'DELETE'
};
const mappingToOptions = new Map<Function, MappingOptions>();
const clientFactoryToUrl = new Map<Function, string>();

function sub<NestedClient extends RestClient>(clientGetter: () => NestedClient) {
    const clientFactory = function(id: string): NestedClient {
        const basePath = clientFactoryToUrl.get(clientFactory);
        const client = clientGetter();

        initClient({
            client,
            url: urlJoin(basePath, id)
        });

        return client;
    };
    clientFactoryToUrl.set(clientFactory, '');
    return clientFactory;
}

function subPath<NestedClient extends RestClient>(pathRegExp: RegExp, clientGetter: () => NestedClient) {
    const clientFactory = function(subPath: string): NestedClient {
        const basePath = clientFactoryToUrl.get(clientFactory);
        const client = clientGetter();

        if (!pathRegExp.test(subPath)) {
            throw new Error(
                `Provided sub path doesn't match the path regexp.\n` +
                `Sub path: "${subPath}", pattern: "${pathRegExp.source}"`
            );
        }

        initClient({
            client,
            url: urlJoin(basePath, subPath),
        });

        return client;
    };
    clientFactoryToUrl.set(clientFactory, '');
    return clientFactory;
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
    const mapping = function(...args: [DataType] | [string, DataType]): Promise<ResponseType> {
        if (args.length === 1) {
            const [body] = args;

            return request({mappingOptions: mappingToOptions.get(mapping), body});
        } else if (args.length === 2) {
            const [id, body] = args;

            return request({mappingOptions: mappingToOptions.get(mapping), id, body});
        }
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

    walkObject(options.client, ({ value, location, key, isLeaf }) => {
        if (!isLeaf) return;

        const resourcePath = location.slice(0, location.length - 1).join('/');
        const nestedClientPath = urlJoin(options.url, resourcePath);

        if (clientFactoryToUrl.has(value)) {
            clientFactoryToUrl.set(value, nestedClientPath);
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

    Object.freeze(options.client);
}


export {
    getMapping,
    getAllMapping,
    postMapping,
    putMapping,
    deleteMapping,
    sub,
    subPath,
    initClient,
};
