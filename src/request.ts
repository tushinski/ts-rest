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

type RequestModifiers = {
    requestOptionsModifier: RequestOptionsModifier,
    responseModifier: ResponseModifier,
    requestBodyModifier: RequestBodyModifier
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
    requestOptionsModifier: (defaultOptions) => defaultOptions,
    requestBodyModifier: (body) => JSON.stringify(body),
    responseModifier: (resp) => resp.json()
};

export function request({mappingOptions, body, params, id}: RequestOptions) {
    let url = `${mappingOptions.descriptorOptions.url}${mappingOptions.path}`;
    const requestOptions: RequestInit = {
        ...defaultModifiers.requestOptionsModifier(defaultRequestOptions, mappingOptions.path, mappingOptions.method),
        method: mappingOptions.method
    };

    if (id) {
        url += `/${id}`;
    }

    if (params) {
        url += `/?${encodeUrlParams(params)}`;
    }

    if (body !== undefined) {
        requestOptions.body = defaultModifiers.requestBodyModifier(body, mappingOptions.path, mappingOptions.method);
    }

    return fetch(url, requestOptions)
        .then(defaultModifiers.responseModifier)
}