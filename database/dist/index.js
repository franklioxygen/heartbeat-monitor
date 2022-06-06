"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const cors = require('cors');
const app = express();
const jsonDBPort = 3000;
const dbHelperPort = 3001;
const serverAddress = 'http://localhost';
// enable cors
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.get('/', (_, res) => {
    res.send('this is a database helper');
});
// heartbeats endpoint indicates that the sensor is online
app.get('/status', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield fetch(`${serverAddress}:${jsonDBPort}/sensors`)
        .then(response => response.json())
        .catch(function () {
        // handle the error
    });
    let status = response.map((sensor) => {
        return {
            serial: sensor.serial,
            userName: sensor.userName,
            // if over 10 minutes, will show offline
            onLine: new Date().getTime() < sensor.lastUpdated + 1000 * 60 * 10,
        };
    });
    res.send('<h1>Sensors Status</h1>' + JSON.stringify(status, null, '\n'));
}));
// send requests to database
app.post('/heartbeats', jsonParser, (req, res) => {
    res.send('ok');
    // insert new heartbeat record into database
    const addRecordOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            bpm: req.body.bpm,
            userName: req.body.userName,
            timestamp: req.body.timestamp,
        })
    };
    fetch(`${serverAddress}:${jsonDBPort}/heartbeats`, addRecordOptions)
        // .then(response => response.json())
        .catch(error => console.log('error', error));
    // update sensor's last update time
    const updateSensorOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            lastUpdated: req.body.timestamp,
        })
    };
    fetch(`${serverAddress}:${jsonDBPort}/sensors/${req.body.id}`, updateSensorOptions)
        // .then(response => response.json())
        .catch(error => console.log('error', error));
});
app.listen(dbHelperPort, () => { });
