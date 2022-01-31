import {HTTPMethod, RequestModification} from "./request-types";

export type RequestOptionsModifier = (defaultOptions: RequestModification, path: string, method: HTTPMethod) => RequestModification;

export type ResponseModifier = (resp: Response, path: string, method: HTTPMethod) => any;

export type RequestBodyModifier = (body: any, path: string, method: HTTPMethod) => BodyInit | null;

export type ModifiersMap = {
    optionsModifier?: RequestOptionsModifier,
    bodyModifier?: RequestBodyModifier,
    responseModifier?: ResponseModifier,
};