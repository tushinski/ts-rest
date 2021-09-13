import {encodeUrlParams, URLParams} from "./utils/encode-url-params";
import {MappingOptions} from "./common-typings";

const fetch = require('fetch-method').default;

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export function request(options: {mappingOptions: MappingOptions, body?, params?: URLParams, id?: string}) {
    const requestOptions: RequestInit = {};
    let url = `${options.mappingOptions.descriptorOptions.url}${options.mappingOptions.path}`;

    if (options.id) {
        url += `/${options.id}`;
    }

    if (options.params) {
        url += encodeUrlParams(options.params);
    }

    if (options.body !== undefined) {
        requestOptions.body = JSON.stringify(options.body);
    }

    return fetch(url, options)
        .then(res => res.json())
}