import {encodeUrlParams, URLParams} from "./utils/encode-url-params";
import {MappingOptions} from "./common-typings";

const fetch = require('fetch-method').default;

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// RequestInit type without 'body' and 'method' props.
type RequestInitOverriding = {
    cache?: RequestCache;
    credentials?: RequestCredentials;
    headers?: HeadersInit;
    integrity?: string;
    keepalive?: boolean;
    mode?: RequestMode;
    redirect?: RequestRedirect;
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
    signal?: AbortSignal | null;
    window?: any;
};
type RequestOptionsModifier = (defaultOptions: RequestInitOverriding, path: string, method: HTTPMethod) => RequestInitOverriding;
type ResponseModifier = (resp: Response, path: string, method: HTTPMethod) => any;
type RequestBodyModifier = (body: any, path: string, method: HTTPMethod) => BodyInit | null;

export type RequestModifiers = {
    optionsModifier?: RequestOptionsModifier,
    bodyModifier?: RequestBodyModifier,
    responseModifier?: ResponseModifier,
};

type RequestOptions = {
    mappingOptions: MappingOptions,
    body?,
    params?: URLParams,
    id?: string
};

const defaultRequestOptions: RequestInitOverriding = {
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    }
};

const defaultModifiers: RequestModifiers = {
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

    if (requestOptions.body && mappingOptions.method === 'GET') {
        console.log({url, requestOptions});
    }

    return fetch(url, requestOptions)
        .then((resp) => {
            if (requestModifiers.responseModifier) {
                return requestModifiers.responseModifier(resp, mappingOptions.path, mappingOptions.method);
            }
            return resp;
        })
}