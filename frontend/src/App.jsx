import React from "react";
import HeartBeatMeter from "./components/HeartBeatMeter";
import './App.css';
const socket = new WebSocket('ws://localhost:8000')

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liveData: []
    };
  }
  componentDidMount() {
    socket.onmessage = event => {
      let parsedData = JSON.parse(event.data);
      let userPositionInLiveData = this.state.liveData.findIndex(user => 
        user.serial === parsedData.serial
      );
      // if the user is not in the liveData array, add them
      if(userPositionInLiveData === -1) {
        this.setState({ liveData: [...this.state.liveData, parsedData] });
      }
      // else the user is in the liveData array, update their data
      else {
        this.setState(({liveData}) => ({
          liveData: [
              ...liveData.slice(0,userPositionInLiveData),
              {
                  ...liveData[userPositionInLiveData],
                  serial: parsedData.serial,
                  userName: parsedData.userName,
                  bpm: parsedData.bpm,
                  timestamp: parsedData.timestamp
              },
              ...liveData.slice(userPositionInLiveData+1)
          ]
        }));
      }
    }
  }
  render() {
    return (
      <div className="App">
        <h2>Heart Beat Monitor</h2>
        {this.state.liveData.map((item, index) => {
          return (
          <HeartBeatMeter
          key={index}
          sensorData={item}
          ></HeartBeatMeter>
          )
        })}
      </div>
    );
  }
}

export default App;