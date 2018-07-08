import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Request, Response } from 'express';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import message from './server/controller/message';
import call from './server/controller/call';
import * as fs from 'fs';
import * as path from 'path';

// create connection with database
// note that its not active database connection
// TypeORM creates you connection pull to uses connections from pull on your requests


// load up appId
let appId;
let maxRetries = 5;
let retry = 1;
console.log('Starting Dennis Bot');

function start() {
    console.log('Reading App Id From Local File System on try: ', retry);
    fs.readFile(path.join(__dirname, '../apikey.json'), 'utf8', (e, data) => {
        if (e) {
            console.log('Failed to read App Id from local file system.', e);
            if (retry++ === maxRetries) {
                // exit
                console.log('Failed to read App Id after max retries of ', maxRetries);
                process.exit(1);
            } else {
                start();
            }
            return;
        }
        console.log('Successfully read app id from local file system');
        appId = data;
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
            console.log('Registiner calls endpoint');
            app.all('/calls', (request: Request, response: Response, next: Function) => {
                call(request, response)
                    .then(() => next)
                    .catch((err: any) => next(err));
            });
            console.log('Registering end points complete, starting listening');
            // run app
            let port = 3000;
            app.listen(port);

            console.log('Dennis Bot is up and running on port: ', port);

        }).catch(error => console.log('TypeORM connection error: ', error));
    });
}
start();
