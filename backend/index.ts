
import * as http from 'http';
import * as WebSocket from 'ws';
import axios from 'axios';
import express from 'express';
var bodyParser = require('body-parser')
const app = express();
const backendServerPort = 8000;
const databasePort = 3000;
const serverAddress = 'http://localhost';
const server = http.createServer(app);
const wss = new WebSocket.Server({ server })
var jsonParser = bodyParser.json()
app.use('/', express.static('../frontend/public'));

let sensors: { 
    serial: any; userName: any; 
}[] = [];

let heartbeats: {
    id: number;
    serial: any;
    userName: any; 
    bpm: number; 
    timestamp: number; 
}[] = [];

const generateBpm = (currBpm: number) => {
    // + or - 
    let sign =  Math.floor(Math.random() * 2) === 0 ? -1 : 1;
    // nextBpm is currBpm +/- <10 
    let nextBpm = currBpm + sign * Math.floor(Math.random() * 10);
    // prevent crazy number generated
    if(nextBpm > 190 || nextBpm < 50) nextBpm = currBpm;
    return nextBpm;
 };

const initialSensorsAndHeartbeats = async () => {
    sensors = [];
    heartbeats = [];
    // fetch sensor data from json-server
    await axios.get(`${serverAddress}:${databasePort}/sensors`)
    .then((res: { data: { id: number; serial: any; userName: any }[]; }) => {
        res.data.forEach((element: { id: number; serial: any; userName: any; }) => {
            // save sensors data
            sensors.push({
                serial: element.serial,
                userName: element.userName
            })
            // generate heartbeats from sensors
            heartbeats.push({
                id: element.id,
                serial: element.serial,
                userName: element.userName,
                bpm: generateBpm(80),
                timestamp: Date.now(),
            })
        });
    })
    .catch((error: any) => {
        console.log(error);
    });
};

wss.on('connection', ws => {
    initialSensorsAndHeartbeats();

    // in case need add control flow
  ws.on('message', message => {
    console.log(`Received message => ${message}`)
  })
    // ------- each heartbeat send separately --------
    let interval = setInterval(function(){
        heartbeats.map(user => {
            let updatedUserData = ({
                id: user.id,
                serial: user.serial,
                userName: user.userName,
                bpm: generateBpm(user.bpm),
                timestamp: Date.now(),
            });
            setTimeout(() => {
                // send updated data to frontend
                ws.send(JSON.stringify(updatedUserData));
            }, Math.random() * 1000)
        })
    }, 1000);   

  ws.on('close', function close() {
    clearInterval(interval);
  });
})

server.listen(backendServerPort, () => {
  console.log(`Listening at ${serverAddress}:${backendServerPort}`)
})