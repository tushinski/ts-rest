# ts-rest
Universal REST API client for TypeScript.

✅ Pure REST <br>
✅ Strongly typed <br>
✅ Customizable <br>
✅ Tested <br>
✅ JSON (de)serialization out of the box

## Installation
browser version: <br>
`npm i @tushinski/ts-rest` <br>

node.js version: <br>
`npm i @tushinski/ts-rest-node` <br>

## Quick start
#### ☝ Create a client
```typescript
    import { getMapping, initClient } from 'ts-rest';

    const restClient = {
        users: {
            get: getMapping<{}, { name: string }>(), // mapping for [GET] /users/:id
        }
    }
```

#### ✌ Initialize
```typescript
    initClient({
        client: restClient,
        url: `https://example.com/rest`
    })
```

#### 🤟 Use
```typescript
    restClient.users.get('alex')
        .then(user => console.log(user.name));

    // the resulting request: [GET] https://example.com/rest/alex
```

## Documentation
### Client
A plain object representing the tree structure of a target API.

For example, for an API, providing these methods:

`[GET] /docs/:id` <br>
`[POST] /docs/` <br>
`[PUT] /docs/:id`

a client will look like this:
```typescript
    const client = {
        docs: {
            get: getMapping<{}, Document>(),
            post: postMapping<Document, Document>(),
            put: putMapping<Document, Document>() 
        }
    }
```
_(where `Document` is a user-defined type)_

### Mappings
Ts-rest provides several functions for mappings. <br>
Their generic types are used to specify types of different request parameters.

#### GET (single resource)
Mapping:
```typescript
{
    get: getMapping<ParamsType, ResponseType>()
}
```
Usage:
```typescript
client.get(id?: string, params?: ParamsType)
```

#### GET (collection)
Mapping:
```typescript
{
    getAll: getAllMapping<ParamsType, ResponseType>()
}
```
Usage:
```typescript
client.getAll(params?: ParamsType)
```

#### POST
Mapping:
```typescript
{
    post: postMapping<DataType, ResponseType>()
}
```
Usage:
```typescript
client.post(body: DataType)
```

#### PUT
Mapping:
```typescript
{
    put: putMapping<DataType, ResponseType>()
}
```
Usage:
```typescript
client.put(id: string, body: DataType)
```

#### DELETE
Mapping:
```typescript
{
    delete: deleteMapping<DataType>()
}
```
Usage:
```typescript
client.delete(id: string)
```

### Mapping types
- `ResponseType` - type of response body
- `DataType` - type of request body
- `ParamsType` - type of a search query parameters map

### Search query parameters (ParamsType)
You can specify search query parameters using a plain object:
```typescript
    const moviesApiClient = {
        movies: {
            getAll: getAll<{genre: string, year: number}>()
        }
    }
    
    // initialization...
    
    moviesApiClient.movies.getAll({genre: 'drama', year: 1966})
```

### Sub-resources
In most of the cases paths of single resources end with a single path parameter - 
a resource id. 
But there are cases when a resource contains nested collections (or sub-resources), like:

`<api_path>/actors/{actorId}/movies`

Ts-rest provides special function `sub` for describing sub resources:
```typescript
    const client = {
        actors: {
            single: sub(() => ({
                movies: {
                    getAll: getAllMapping<{}, Movie[]>()
                },
            }))
        }
    }

    client.actors.single(1).movies.getAll() // [GET] <api_path>/actors/1/movies
        .then(movies => {/*...*/})
```
You can think of it like of getting a _single_ resource by id:

`<api_path>/actors/1`

and working with it's sub-resources:

`<api_path>/actors/1/movies`

Since the `single` method only returns a "sub-client" (and doesn't perform any requests),
it's result can be stored to a variable for reusing:
```typescript
const actor1 = client.actors.single(1);

actor1.movies.getAll()
    .then(movies => /*...*/);

actor1.awards.post(/* award data */)
    .then(award => /*...*/);
```

### Request modifiers
Request modifiers are used to modify request parameters and response data during a request.

They can be specified with the `requestModifiers` option (see _Initialization_).

#### Options modifier
Modifies default request parameters (such as headers, content type, etc.);

`optionsModifier: (defaultOptions: RequestModification, path: string, method: HTTPMethod) => RequestModification`

#### Body modifier
Modifies request body.

`bodyModifier: (resp: Response, path: string, method: HTTPMethod) => any`

#### Response modifier
Modifies response data.

`responseModifier: (body: any, path: string, method: HTTPMethod) => BodyInit | null`

#### Default modifiers
If custom modifiers are not specified, default modifiers are used:
```typescript
{
    optionsModifier: (defaultOptions) => defaultOptions,
    bodyModifier: (body) => JSON.stringify(body),
    responseModifier: (resp) => resp.json()
};
```

