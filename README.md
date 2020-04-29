# Loan Repayment Calculator

## Running application locally

1. Open the backend folder in a cmd terminal such as bash or cmd.
2. Run the command "npm install"
3. Create a new file ".env" and update the following keys

```
PORT=1337
NODE_ENV=development
CORS_WHITELIST=http://localhost:5001

API_HOST=localhost
API_BASEPATH=/

JWT_SECRET= YOUR_SECRET_HERE

GOOGLE_API_KEY= YOUR_GOOGLE_API_KEY_HERE
GOOGLE_OAUTH_CLIENT_ID= YOUR_GOOGLE_CLIENT_KEY_HERE
GOOGLE_OAUTH_CLIENT_SECRET= YOUR_GOOGLE_SECRET_KEY_HERE

FACEBOOK_OAUTH_CLIENT_ID= YOUR_FACEBOOK_CLIENT_KEY_HERE
FACEBOOK_OAUTH_CLIENT_SECRET= YOUR_FACEBOOK_SECRET_KEY_HERE

DB_HOST= YOUR_KEY
DB_NAME= YOUR_KEY
DB_PORT= YOUR_KEY
DB_INSTANCE_NAME= YOUR_KEY
DB_USERNAME= YOUR_KEY
DB_PASSWORD= YOUR_KEY

SITE_EMAIL=repayment.dev@gmail.com
SITE_EMAIL_PASSWORD=AL3x3lam15$

APM_URL=https://f8feaea9b54f40f08a249f4ac7b164d2.apm.eastus2.azure.elastic-cloud.com
APM_SECRET_TOKEN=Sw4WA7Vbj9qLNsEgdT

ELASTIC_URL=https://aaa436a72f0d4f34965c0664f7660a90.eastus2.azure.elastic-cloud.com:9243
ELASTIC_USERNAME=elastic
ELASTIC_PASSWORD=hfxVUiVGayE9jj9bWc5etUot
```

4. Run the commnad "npm run db:migrate" to initiallize you're database.
5. Run the command "npm run watch" and the backend should start successfully

6. Open the frontend folder in a cmd terminal. This is a basic Create-React-App and can be started as such
7. Run "npm install"
8. Create a new file ".env" and update the following keys

```
REACT_APP_API_BASE_URL=http://localhost:5000:1337
```

9. Run "npm start"

## File Structure

### /backend

1. /backend/design
   - Updated design documents for Database and Service endpoints.
2. /backend/dist
   - build folder
3. /backend/src
   - soruce files that are compiled by babel into dist folder
4. /backend/patches
   - Files here are related to [Patch-Package](https://www.npmjs.com/package/patch-package)
   - Updates node_modules during post-install script
5. /backend/test

### /frontend

1. /frontend/design
   - Updated design documents for user interface and interactions.
2. /frontend/public
3. /frontend/src
   - ReactJS source files.

### /style_guide

1. Barebones ReactJS project that with example of application's style and components.
   TEST
