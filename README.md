# ts-rest
Library for creating typed REST clients.

Used for client side. Based on [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). 

`npm i @tushinski/ts-rest`

## Usage
```typescript
    import { getMapping, postMapping, initApi } from 'ts-rest';

    const apiUrl = `https://example.com/rest`;

    // your client object (or API descriptor)
    const api = {
        users: {
            GET: getMapping<string, User>(), // mapping
        },
        products: {
            GET: getMapping<string, Product>(),
            POST: postMapping<Product, Product>()
        }   
    };
    
    // initialization
    initApi(api, apiUrl);
    
    // usage
    api.users.GET('id011235813')
        .then(user => { /*...*/ });
```

##### Client object (or API descriptor)
A plain object representing tree structure of target API.

The object from example represents an API which provide methods:
- `[GET] /users/:id`
- `[GET] /products/:id`
- `[POST] /products/`

##### Mappings
Ts-rest provides several functions to create mappings for each HTTP method.
Key of a mapping property must be a name of corresponding HTTP method.

##### Initialization
Function `initApi` initializes the client object for it can be used for requests.

## Documentation
#### GET (single resource)
Mapping function: `getMapping<ParamsType, ResponseType>()`
- ParamsType - type of URL parameters object
- ResponseType - type of data received through the method

Corresponding property name: GET

Created client method: `GET(id: string, params?: ParamsType)`

#### GET (collection)
Mapping function: `getAllMapping<ParamsType, ResponseType>()`
- ParamsType - type of URL parameters object
- ResponseType - type of data received through the method

Corresponding property name: _GET

Created client method: `_GET(id: string, params?: ParamsType)`

#### POST
Mapping function: `postMapping<DataType, ResponseType>()`
- DataType - type of the data provided for response body
- ResponseType - type of data received through the method

Corresponding property name: POST

Created client method: `POST(body: DataType)`

#### PUT
Mapping function: `putMapping<DataType, ResponseType>()`
- DataType - type of the data provided for response body
- ResponseType - type of data received through the method

Corresponding property name: PUT

Created client method: `PUT(id: string, body: DataType)`

#### DELETE
Mapping function: `deleteMapping<DataType>()`
- DataType - type of the data provided for response body
- ResponseType - type of data received through the method

Corresponding property name: DELETE

Created client method: `DELETE(id: string)`

#### Initialization
Function interface:

`initApi(descriptor: ResourceDescriptor, url: string, options?: ApiOptions)`
- descriptor - object with mappings (client object)
- url - base url of target API
- options - additional client options

##### Client options
- commonRequestOptions - [init parameter](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#parameters)
 of the `fetch` method. The parameter will be used for every request.
