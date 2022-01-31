import {URLParams} from "../utils/encode-url-params";
import {MappingOptions} from "./client-types";

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type RequestModification = Omit<RequestInit, "body" | "method">;

export type RequestOptions = {
    mappingOptions: MappingOptions,
    body?,
    params?: URLParams,
    id?: string
};