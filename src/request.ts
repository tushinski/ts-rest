import {encodeUrlParams} from "./utils/encode-url-params";
import {RequestModification, RequestOptions} from "./types/request-types";
import {ModifiersMap} from "./types/modifiers-types";

const fetch = require('fetch-method').default;

const defaultRequestOptions: RequestModification = {
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    }
};

const defaultModifiers: ModifiersMap = {
    optionsModifier: (defaultOptions) => defaultOptions,
    bodyModifier: (body) => JSON.stringify(body),
    responseModifier: (resp) => resp.json()
};

export function request({mappingOptions, body, params, id}: RequestOptions) {
    let url = `${mappingOptions.descriptorOptions.url}${mappingOptions.path}`;
    let requestOptions: RequestInit;
    const requestModifiers = {
        ...defaultModifiers,
        ...mappingOptions.descriptorOptions.requestModifiers
    };

    if (requestModifiers.optionsModifier) {
        requestOptions = requestModifiers.optionsModifier({...defaultRequestOptions}, mappingOptions.path, mappingOptions.method);
    } else {
        requestOptions = defaultRequestOptions;
    }
    requestOptions.method = mappingOptions.method;

    if (id) {
        url += `/${id}`;
    }

    if (params) {
        url += `/?${encodeUrlParams(params)}`;
    }

    if (body !== undefined) {
        if (defaultModifiers.bodyModifier) {
            requestOptions.body = requestModifiers.bodyModifier(body, mappingOptions.path, mappingOptions.method);
        } else {
            requestOptions.body = body;
        }
    }

    return fetch(url, requestOptions)
        .then((resp) => {
            if (requestModifiers.responseModifier) {
                return requestModifiers.responseModifier(resp, mappingOptions.path, mappingOptions.method);
            }
            return resp;
        })
}