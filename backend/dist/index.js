"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const WebSocket = __importStar(require("ws"));
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
var bodyParser = require('body-parser');
const app = (0, express_1.default)();
const backendServerPort = 8000;
const databasePort = 3000;
const serverAddress = 'http://localhost';
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
var jsonParser = bodyParser.json();
app.use('/', express_1.default.static('../frontend/public'));
let sensors = [];
let heartbeats = [];
const generateBpm = (currBpm) => {
    // + or - 
    let sign = Math.floor(Math.random() * 2) === 0 ? -1 : 1;
    // nextBpm is currBpm +/- <10 
    let nextBpm = currBpm + sign * Math.floor(Math.random() * 10);
    // prevent crazy number generated
    if (nextBpm > 190 || nextBpm < 50)
        nextBpm = currBpm;
    return nextBpm;
};
const initialSensorsAndHeartbeats = () => __awaiter(void 0, void 0, void 0, function* () {
    sensors = [];
    heartbeats = [];
    // fetch sensor data from json-server
    yield axios_1.default.get(`${serverAddress}:${databasePort}/sensors`)
        .then((res) => {
        res.data.forEach((element) => {
            // save sensors data
            sensors.push({
                serial: element.serial,
                userName: element.userName
            });
            // generate heartbeats from sensors
            heartbeats.push({
                id: element.id,
                serial: element.serial,
                userName: element.userName,
                bpm: generateBpm(80),
                timestamp: Date.now(),
            });
        });
    })
        .catch((error) => {
        console.log(error);
    });
});
wss.on('connection', ws => {
    initialSensorsAndHeartbeats();
    // in case need add control flow
    ws.on('message', message => {
        console.log(`Received message => ${message}`);
    });
    // ------- each heartbeat send separately --------
    let interval = setInterval(function () {
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
            }, Math.random() * 1000);
        });
    }, 1000);
    ws.on('close', function close() {
        clearInterval(interval);
    });
});
server.listen(backendServerPort, () => {
    console.log(`Listening at ${serverAddress}:${backendServerPort}`);
});
