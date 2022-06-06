import React from "react";
import "../App.css";
class HeartBeatMeter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.sensorData.id,
      bpm: this.props.sensorData.bpm,
      userName: this.props.sensorData.userName,
      timestamp: this.props.sensorData.timestamp,
      time: this.genTime(this.props.sensorData.timestamp),
      records: [],
    };
  }
  genTime(timestamp) {
    // convert timestamp to readable time
    let date =  new Date(timestamp);
     let hrs = `0${date.getHours()}`.slice(-2);
     let min = `0${date.getMinutes()}`.slice(-2);
     let sec = `0${date.getSeconds()}`.slice(-2);
     return hrs + ':' + min + ':' + sec;
  }
 async componentDidUpdate(prevProps){
   // if the sensor data changes, update the state
  if(prevProps.sensorData.timestamp !== this.props.sensorData.timestamp){
    this.setState({
      bpm: this.props.sensorData.bpm,
      timestamp:  this.props.sensorData.timestamp,
      time: this.genTime(this.props.sensorData.timestamp),
    });
    this.setState({
      records: [...this.state.records, this.state.bpm]
     });
//----post to database-------
  const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
      body: JSON.stringify({
        id: this.state.id,
        bpm: this.state.bpm,
        userName: this.state.userName,
        timestamp: this.state.timestamp,
      })
  };
  await fetch('http://localhost:3001/heartbeats', requestOptions)
  .catch(error => console.log('error', error));
  }
 }
  render() {
    return (
      <div className="user-container">
        <div className="meter-container">
          <div className="space" style={{ "height": "calc("+(1-this.state.bpm/190)*100+"% - 50px)"}}></div>
          <div className="bar" style={{ "height": (this.state.bpm/190)*100+"%"}}></div>
          <div className="read">{this.state.bpm} bpm</div>
          <div className="userName">{this.state.userName}</div>
          <div className="time">{this.state.time}</div>
        </div>
        <div className="records-container">
          <div className="records-scroll">
            {this.state.records.map((item, index) => (
            <div className="record-bar" key={index} style={{ "height": (item/190)*100+"%", "top": (1-item/190)*100+"%"}}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
export default HeartBeatMeter;