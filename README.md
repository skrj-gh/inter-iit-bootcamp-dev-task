# Inter IIT Bootcamp Dev Task

### Here all the queries sent by client is NOT served by local server but remotely deployed server. I have left the link for server, rather than putting it in .env for your convience.
### I haven't used localhost as we require .env in both client (for Firebase api keys) and server(for Gemini api key, MongoDB api key and Port on which server is running).

### How to run
- Clone the repository
- To start client, run the following commands
```bash
cd client
npm install
npm run dev
```
- To start server, run the following commands
```bash
cd server
npm install
npx nodemon index.js
```
