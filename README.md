# [Vesta](http://vesta.bz) Core Libraries

## List of libraries [Alphabetically]
### `Condition`
Low level condition for `Vql` [It is much easier to use `Hlc` -more on that later].
    
### `Culture`
Providing support for i18n, i10n.
You may build your own culture by providing 3 arguments: 

- `locale`: An object that provides the cultural information and is of type `ILocale`
- `vocabs`: An object that the keys are the words to be translated and the values are the translation of keys
- `dateTime`: A class that provides support for locale dateTime and extends the `DateTime` class

After proving these arguments you may register your locale like this:
```javascript
import { Culture } from "@vesta/core";
// ...
Culture.register(myLocal, myVocabs, MyDateTime);
// ... 
```
In case of multiple culture the first culture is considered to be the default culture. You may change the default culture using `Culture.setDefault(cultureCode);`
In any part of your application you may access these parameters by the following static methods:
```javascript
// at any of the following examples, if no localeCode is provided, the default locale code will be used
// get locale object
const locale = Culture.getLocale(localeCode);
// get DateTime instance
const dateTime = Culture.getDateTimeInstance(localeCode);
// get dictionary
const vocabs = Culture.getDictionary(localeCode);
```

### `Database`
### `DateTime`
`abstract DateTime` class that any localized DateTime must extend
### `Dictionary`
dictionary is the storage of `key: translation` and some methods for finding vocabs and extending the translations. keys are NOT case-sensitive.
```javascript
import { Dictionary } from "@vesta/core";
// ...
const dictionary = new Dictionary();
// adding vocabs to dictionary
dictionary.inject(myVocabs);
// retrieving the relevant translation of a key
var translation = dictionary.lookup(myKey);
```
`Culture` uses this class for handling vocabs. You may access the `Dictionary` object by `Dictionary.getDictionary` method;
### `Err`
Provides a class for customr `Error`s since the default class has some limitations.
To create new `Err` you may use `Err.Code.*` to clarify error types. 
The following errors are two most used errors so we encapsulate them into new `Err` classes [`extends Err`]:
* `DatabaseError`
* `ValidationError`
### `Field`
### `Hlc (High Level Condition)`
Using this class you may create any kind of -even very complex- conditions which is used by `Vql` to build a query.
```javascript
import { Condition, Hlc as C, Vql } from "@vesta/core";
import { MyModel } from "./path/to/model";
// ... 
// let's assume a table with the fields of firstName, lastName, age,
// we want to create q WHERE statement like the following
// (firstName=lastName AND age <= 30) OR (firstName<>lastName AND age > 30)
const condition: Condition = C.or(
    C.and(
        C.eq("firstName", "lastName", true), // third params set to true indicates that the lastName is a field of table and not a value
        C.elt("age", 30)
    ),
    C.and(
        C.not(C.eq("firstName", "lastName", true)),
        C.gt("age", 30)
    ),
);
var query = new Vql(MyModel.schema.name);
query.where(condition);
var result = await MyModel.find(query);
```
### `Mime`
Querying `mime/type` based on extensions.
```javascript
import { Mime } from "@vesta/core";
// ... adding new mimeType
Mime.addMime("MyExt", "MyExtMimeType");
// ... returieving mimeType
const mimeType = Mime.find("jpg");
```
### `Model`
`abstract Model` class that any other models must extend. Do not create new models manually, instead use `vesta` cli. Go to the root of the project directory and on command line execute `vesta gen model ModelName`. The tool will ask you several questions for each fields and generates the model automatically.
This model is shared between client and server.
In model file you may provide extra meta for more customization.
### `Platform`
Provides information about the platform at which the application is executing, e.g. `Platform.isServer()`, `Platform.isAndroid()`, ...
### `Sanitizer`
### `Schema`
### `Validation`
### `Vql (Vesta Query Language)`
Provides the query builder for `Model`s to execute queries and retrieve records.
```javascript
import { Vql } from "@vesta/core";
import { SomeModel } from "./pth/to/model";
// ... creating new vql
const query = new Vql(SomeModel.schema.name);
// selecting fields
query.select("firstField", "secondField");
// limiting number of result
query.limitTo(10);
// starts from 15th record
query.fromOffset(15);
// the two line before will result in LIMIT 15, 10
// soring result
query.sortBy("firstField", true);
// filtering by fieldName: value 
query.filter({firstName: "first", age: 20});
// for advanced and complex condition you may use Hlc
const result = SomeModel.find(query);
```

You may view [source files](https://github.com/VestaRayanAfzar/vesta-core) for more information