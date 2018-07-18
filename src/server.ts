import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Request, Response } from 'express';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import message from './server/controller/message';
import call from './server/controller/call';
import * as fs from 'fs';
import * as path from 'path';
import {createServer} from 'restify';
import {createServer as httpsCreateServer } from 'https';
let builder = require('botbuilder');


// express is for web while restify is purely for skype communication
// create connection with database
// note that its not active database connection
// TypeORM creates you connection pull to uses connections from pull on your requests

let keyPath = fs.readFileSync('keyPath.txt').toString();
let certPath = fs.readFileSync('certPath.txt').toString();
let https_options = {
    key: fs.readFileSync(keyPath).toString(),
    certificate: fs.readFileSync(certPath).toString()
};

let express_credentials = {
    key: https_options.key,
    cert: https_options.certificate
};

console.log('Starting Dennis Bot');

function start() {
    console.log('Reading App Id From Local File System');
    fs.readFile(path.join(__dirname, '../apikey.txt'), 'utf8', (e, data) => {
        if (e) {
            console.log('Failed to read App Id from local file system.', e);
        }
        console.log('Successfully read app id from local file system');
        console.log('Starting TypeOrm data base connection');
        createConnection().then(async connection => {
            console.log('Successfully started TypeOrm and connected to database with connection:', connection.name, connection.driver);
            // create express app
            console.log('Creating Express app');
            const app = express();
            app.use(bodyParser.json());

            // register 2 routes here and its to make calls or message the best bot
            console.log('Registering messaging endpoint');
            app.all('/messages', (request: Request, response: Response, next: Function) => {
                message(request, response)
                    .then(() => next)
                    .catch((err: any) => next(err));
            });
            console.log('Registering calls endpoint');
            app.all('/calls', (request: Request, response: Response, next: Function) => {
                call(request, response)
                    .then(() => next)
                    .catch((err: any) => next(err));
            });
            console.log('Registering end points complete, starting listening');
            // run app
            let port = 3001;
            let httpsServer = httpsCreateServer(express_credentials, app);
            httpsServer.listen(port);

            console.log('Dennis Api is up and running on port: ', port);
            console.log('Start restify skype portion');

            let serverPort = 3000;
            // Setup Restify Server
            let server = createServer(https_options);
            server.listen(serverPort, function () {
                console.log('Dennis Bot is listening on', serverPort);
            });

            // Create chat connector for communicating with the Bot Framework Service
            data = data.toString();
            let connector = new builder.ChatConnector({
                appId: data.split(':')[0],
                appPassword: data.split(':')[1]
            });

            // Listen for messages from users 
            server.post('/messages', connector.listen());

            // Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
            builder.UniversalBot(connector, function (session: any) {
                session.send('You said: %s', session.message.text);
            });


        }).catch(error => console.log('TypeORM connection error: ', error));
    });
}
start();
