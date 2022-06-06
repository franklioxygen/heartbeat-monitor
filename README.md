# heartbeat-monitor

### Live Chart Webpage:
http://localhost:8001

![Screen Shot 2022-06-05 at 9 42 57 PM](https://user-images.githubusercontent.com/2637636/172082932-45416286-571d-4b02-9dc4-a3c0ee5843b1.jpg)

### Sensor Status Entrypoint:
http://localhost:3001/status

![Screen Shot 2022-06-05 at 10 17 11 PM](https://user-images.githubusercontent.com/2637636/172083776-cd091aa0-4e1e-4199-a429-ec1d2fad45a6.jpg)

### Database - Sensor API
http://localhost:3000/sensors

### Database - Heartbeats API
http://localhost:3000/heartbeats

### Database Chart
![Screen Shot 2022-06-05 at 10 47 16 PM](https://user-images.githubusercontent.com/2637636/172086084-355e6ef4-fa2c-4226-ad1d-2368075e2472.jpg)

### Data/Control Flow
![Screen Shot 2022-06-05 at 10 23 05 PM](https://user-images.githubusercontent.com/2637636/172084163-ce40b861-2ce5-4c67-a736-ab7591c4074d.jpg)


### Description

This project is implemented with ExpressJS in TypeScript (backend/databse).
And React (Frontend).

Make sure Node version > 18
```
  "engines": {
    "npm": ">=8.0.0",
    "node": ">=18.0.0"
  },
```


Backend build websocket connection to frontend.
Then pull sensors data from database, generate heartbeats in random time based on sensor number.

Frontend render DOMs to display all sensors(users) status, at the same time send heartbeat data to database.

Database append heartbeat record, and update latest time in sensors.

Database entrypoint display if the sensor is updated in 10 mins. Otherwise will show offline.


## Install:

Script will install all frontend/backend/database at one time.
```
npm run install
```
## Run:

Script will run all frontend/backend/database concurrently.
```
npm run start
```

### Todo

When frontend post data to database, sometimes database serve can't handle cocurrent requests. 
This will cause response missing error in browser console.
