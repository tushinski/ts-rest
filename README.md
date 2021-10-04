# ts-rest
Library for creating typed REST clients.

Based on [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

_NodeJS version coming soon..._

## Installation
`npm i @tushinski/ts-rest`

## Concept
Ts-rest library created to make working with REST API organized, simple and clear.
It proposes you to create a single configuration object, describing methods of a REST API,
including allowed parameters, request body type and response type. 
This object's called _API descriptor_. The same object, after it is initialized, 
becomes strongly typed REST client.

## Usage
```typescript
    import { getMapping, postMapping, initClient } from 'ts-rest';

    // your API descriptor
    const api = {
        users: {
            get: getMapping<undefined, User>(), // mapping
        },
        products: {
            get: getMapping<undefined, Product>(),
            post: postMapping<Product, Product>()
        }   
    };
    
    // initialization
    initClient({
        descriptor: api,
        url: `https://example.com/rest`
    });
    
    // fetching user data
    api.users.get('id011235813')
        .then(user => { /*...*/ });
```

## Documentation
### API descriptor
A plain object representing a tree structure of target API.

The object from the example represents an API that provides these methods:
- `[GET] /users/:id`
- `[GET] /products/:id`
- `[POST] /products/`

### Mappings
Ts-rest provides several functions for creating of mappings for each HTTP method.

#### GET (single resource)
Mapping:
```typescript
{
    get: getMapping<ParamsType, ResponseType>()
}
```
Usage:
```typescript
api.get(id?: string, params?: ParamsType)
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
api.getAll(params?: ParamsType)
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
api.post(body: DataType)
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
api.put(id: string, body: DataType)
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
api.delete(id: string)
```

### Response type
ResponseType - the type of response you expected.
Ts-rest parses JSON responses by default, so you can specify a type of the final data 
you expect to receive.

### Data type
DataType - a type of data sent in the request body.
Ts-rest encodes request body data to JSON string by default.

### URL query parameters
Search query parameters is specified with a plain object,
containing `parameter: value` pairs:
```typescript
movieApi.movies.getAll({genre: 'drama', year: 1966})

// the request url will be: '/movies/?genre=drama&year=1966'
```
You can declare a type of parameters object for GET methods (see _Mappings_).

### Initialization
Ts-rest provides the function for an API descriptor initialization:
`initClient(options: ClientOptions)`

Options object properties:
- url - url of target API
- descriptor - API descriptor
- requestModifiers (optional) - object containing request modifiers (see _Request modifiers_)

After the descriptor object initialized it becomes a REST client and can be used for requests.

### Sub-resources (nested descriptors)
In most of the cases paths of single resources end with a single path parameter - 
resource id. For example:

`/api/movies/{movieId}`

But there are cases when a resource contains nested collections (or sub-resources):

`/api/actors/{actorId}/movies`

Ts-rest provides special function `sub` to describe nesting:
```typescript
const api = {
    actors: {
        single: sub(() => ({
            movies: {
                getAll: getAllMapping<undefined, Movie[]>()
            },
        }))
    }
}
```
Nesting is described with a special property `single`, using the `sub` function,
which accepts single argument - a function returning nested descriptor.

That's how requests to sub-resources look like with an initialized client:
```typescript
api.actors.single(1).movies.getAll()
    .then(movies => /*...*/)
```
You should think of it like of getting a _single_ resource by id:

`/api/actors/1`

and continuing to work with it's sub-resources:

`/api/actors/1/movies`

Nested descriptor is described by the same rules as the main API descriptor. It can represent it's own tree 
structure and contain any mappings.

Since the `single` method only returns a nested descriptor (and doesn't perform any requests), 
it's result can be written to a variable and reused:
```typescript
const actor1 = api.actors.single(1);

actor1.movies.getAll()
    .then(movies => /*...*/);

actor1.awards.post(/* award data */)
    .then(award => /*...*/);
```

Also, nested descriptor can contain other nested descriptors.


### Request modifiers
Request modifiers are special functions used to modify REST client requests.

They can be specified with `requestModifiers` option (see _Initialization_).

#### Options modifier
Modifies default options, which will be passed 
to the `fetch` call during a request;

`optionsModifier: (defaultOptions: RequestInitOverriding, path: string, method: HTTPMethod) => RequestInitOverriding`

#### Body modifier
Modifies data of request body.

`bodyModifier: (resp: Response, path: string, method: HTTPMethod) => any`

#### Response modifier
Modifies response returning by `fetch` during request.

`responseModifier: (body: any, path: string, method: HTTPMethod) => BodyInit | null`

#### Default modifiers
If custom modifiers are not specified, default modifiers are used:
```typescript
{
    optionsModifier: (defaultOptions) => defaultOptions, // contains 'application/json' content header
    bodyModifier: (body) => JSON.stringify(body),
    responseModifier: (resp) => resp.json()
};
```

