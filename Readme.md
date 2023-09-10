# Job task

Requirments: 
- Express.js, TypeScript and OOP, as a REST API.
- MySQL database (User: name, phone, password | Product: title, image, price, user_id)
- JWT authentication & authorization (prevent users from editing or removing others' products)


characteristics:
- Using TypeORM
- Centralized Error handling.
- JWT Authentication & Authorization.
- Morgan & Winston for login.
- Express-validator & Yup for data validation.
- Using PM2 for process management & ENVs.

To be further improved with:
- benefiting from tsyringe in decomposing the project, and provide better testing, with lower maintainability.
- with further business needs, we can use Redis for caching responses.

### Notes
Make sure to declare ENV properties in PM2 config file, and generate JWT keys before.
To generate JWT keys:

```bash
$ openssl genrsa -out jwtRSA256-private.pem 2048

$ openssl rsa -in jwtRSA256-private.pem -pubout -outform PEM -out jwtRSA256-public.pem
```

And you need to have adjust E2E tests' data with your local database.
## File Structure

- _app.ts_ is the main file for app logic, initializing middlewares and routes, and
  connecting to our MongoDB.

- _index.ts_ is the server file to run the app.

- _db.ts_ is the config file for PostgreSQL.

- _redis.ts_ is the config file for redis.

- _ecosystem.example.config.js_ is a template to generate PM2 config file _ecosystem.config.js_ for process management and ENVs.

- _./config_ file to import all environment variables, and use a complex
  configuration structure if needed.

- _./components_ file contain app's solutions by self contained components with

  - _entity_ file for TypeORM entities, representing app's data, using (\*.entity.ts) naming convention for each one.

  - _service_ file for communicating(read/write) to our database, and make
    operations on data if needed, then return the data for _./controllers_,
    using (\*.service.ts) naming convention for every module.

  - _controller_ file for coordinating HTTP request & responses, and set needed
    cookies and headers, using (\*.controller.ts) naming convention for every
    module.

  - _route_ file for establishing endpoints and controllers to every modules.
    Beside validating requests, and jwt authentication. Using (\*.route.ts)
    naming convention for every module.

  - _schema_ file for validation data for post and update methods by **Yup**.
    Using (\*.schema.ts) naming convention for every module.

  - _./interface_ file for types' declarations, using (\*.interface.ts) naming
    convention for every module, beside \_**\_types\_\_** for general types. Every interface has an Enum: **ERROR_MSG** for this interface error messages.

- _./interfaces_ for shared interfaces, types and Entities.

- _./middlewares_ file for containing reused middlewares, which are used across
  the app, using (\*.middleware.ts) naming convention for every module.

- _./utils_ file for containing reused functions, centralized error handling, shared schemas, which are used across the app.

- _./tests/e2e_ for E2E tests
