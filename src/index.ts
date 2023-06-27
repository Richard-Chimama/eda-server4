/* import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from "cors"
import bodyParser from "body-parser"
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs"
import {} from 'http';
import express from 'express'
import { typeDefs } from './Schema.js';
import resolvers from './resolvers/index.js';
import db from './db.js';
import dotenv from "dotenv"
import models from './models/index.js';
import jwt from "jsonwebtoken"
import cloudinary from 'cloudinary'

dotenv.config() */

import { ApolloServer } from '@apollo/server';
import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
//import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingpage/default';
import graphqlUploadExpress  from "graphql-upload/graphqlUploadExpress.mjs";
import { makeExecutableSchema } from '@graphql-tools/schema';
//@ts-ignore
import { WebSocketServer } from 'ws';
import  {useServer}  from 'graphql-ws/lib/use/ws';

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';

import { typeDefs } from './Schema.js';
import resolvers from './resolvers/index.js';
import db from './db.js';
import models from './models/index.js';
//import { MongodbPubSub } from 'graphql-mongodb-subscriptions';
import { PubSub } from 'graphql-subscriptions';
/* import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as Redis from 'ioredis'; */




dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUND_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
})

/* const options = {
  host: 127.0.0.1,
  port: 6002,
  retryStrategy: times => {
    // reconnect after
    return Math.min(times * 50, 2000);
  }
}; */


const DB_HOST = process.env.DB_HOST
const JWT_SECRETE:any = process.env.JWT_SECRETE
const PORT = process.env.PORT || 3304
const pubsub = new PubSub();



// Required logic for integrating with Express
const app = express();

// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer:any = createServer(app);


const schema = makeExecutableSchema({ typeDefs, resolvers });

// Creating the WebSocket server
const wsServer = new WebSocketServer({
// This is the `httpServer` we created in a previous step.
server: httpServer,
// Pass a different path here if app.use
// serves expressMiddleware at a different path
path: '/api'
});

const context = {pubsub, models}

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema, context }, wsServer);


// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer({
  schema,
  csrfPrevention: false, // causes risks in the application when its turned off
  cache: "bounded",
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    //ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    }
  ],
});
  // Ensure we wait for our server to start
  await server.start();

db.connect(DB_HOST)

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
    '/api',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    graphqlUploadExpress(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req }:{req:any}) => { 
        const token = req.headers.authorization
        //try to retrieve the user  with the token
        const user:any = getUser(token)
        const clound = cloudinary.v2
       

        
        return { models, user, clound, pubsub }
     },
    }),
  );



    const getUser = (token:any)  =>{
        if(token){
            try{
                
                //return the user information from the token
                return jwt.verify(token, JWT_SECRETE)
            }catch(err:any){
              if(err.name === 'TokenExpiredError'){
                throw new Error('Session has expired')
              }
                //uf there's a problem with the token, throw am error
                throw new Error('Session invalid')
            }
        }else{
            return null
        }
      }

// Modified server startup
await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(`🚀 Server ready at http://localhost:${PORT}/api`);