# Inter IIT Bootcamp Dev Task

# Deployed Link: https://bit.ly/LazarusAi


## Instructions to run on local

### Here all the queries sent by client is NOT served by local server but remotely deployed server. I have left the link for server, rather than putting it in .env for your convience.
### I haven't used localhost as we require .env in both client (for Firebase api keys) and server(for Gemini api key, MongoDB api key and Port on which server is running).

### To run this on local setup .env file in client with Firebase credentials and .env file in server with GEMINI_API_KEY, MONGO_URI and PORT.
### Also change the request link from server link in context.jsx and sidebar.jsx to http://localhost:PORT

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
