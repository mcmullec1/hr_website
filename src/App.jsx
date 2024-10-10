
import './App.css'
import Monitors from './Monitors';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import logo from "/logo.png"
import DownloadButton from './DownloadButton';
import start from "/start.png"
import stop from "/stop.png"


function App() {

  //current time interval variable
  const [time, setTime] = useState(new Date())

  //bluetooth browser support variable
  const [supportText, setSupportText] = useState('');

  //session data variable for export
  const [overallSessionData, setOverallSessionData] = useState([])

  //start time
  const [startTime, setStartTime] = useState(new Date());

  //stop time
  const [stopTime, setStopTime] = useState('');

  //recording

  const [recording, setRecording] = useState(false);

  //colours to be used throughout the project
  const colours = { 'blue': '#3EA9E0',
                    'plum' : '#3F1D4E',
                    'lime': '#C7D540',
                    'pink' : '#E75172',
                    'light_green': '#00A06E',
                    'dark_green': '#063532'
  }


  

//to handle browsers that do not support Web Bluetooth API
  if (navigator.bluetooth === undefined) {
    useEffect(()=>{
      setSupportText('Bluetooth is not supported.');
    }, []);
  }
  else{
    useEffect(()=>{
      setSupportText('Bluetooth is supported.');
    }, []);
  }



//to update the time variable every 5 seconds
  useEffect(() => {

    const interval = setInterval(() => {
      setTime(new Date());
    }, 5000);

    return () => clearInterval(interval);
    }, [])

      
    const handleDownload = () => {
      console.log("Download")
    }
      
    
  // adding new entries to the overall session data
  //called from the child Monitor component to update in App
  function handleSessionData(data, id){
    let newSessionData = overallSessionData
    newSessionData.push(data)
    setOverallSessionData(newSessionData)
    console.log(overallSessionData)
    //console.log(recording)
    console.log("start",startTime)
    //console.log("stop",stopTime)
    
  }

  function handleRecord(){
    if(recording == false){
      setRecording(true)
      setStartTime(new Date())
    }

    if(recording == true){
      setRecording(false)
      setStopTime(new Date())
    }
    
  }



  return (
    <>
     {/* Header */}
      <Box
        width="100%"
        height="75px"
        backgroundColor={colours["dark_green"]}
        color={colours["light_green"]}
        marginBottom="20px"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >

        {/* Logo */}
        <Box
          component="img"
          sx={{
            height: "60px",
          }}
          alt="University of Roehampton Logo."
          src={logo}
        ></Box>

        {/* Bluetooth message */}
        <p className="bluetooth" >{supportText}</p>

        {/*Start Stop*/}
        <Box>
        <button className='download_button' onClick={() => handleRecord()}>
          <Box
            height="100%"
            width="100%"
            //backgroundColor={colours["light_green"]}
            backgroundColor = {recording === true ? 'red' : colours["light_green"]}
            borderRadius="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              component="img"
              sx={{height: "30px",}}
              alt="Download symbol."
              src={recording === true ? stop : start}
            ></Box>
          </Box>
        </button>
        </Box>

        {/* Download Button */}
        <DownloadButton colours = {colours} overallSessionData = {overallSessionData} startTime = {startTime} stopTime = {stopTime}></DownloadButton>
      </Box>

      {/* Monitor Grid */}
      <Box
        display="flex"
        justifyContent="space-around"
        width="100%"
      >
        <Monitors timeInterval={time} monitor_count = {6} colours = {colours} sendData={handleSessionData}></Monitors>
      </Box>
      
    </>
  )
}

export default App
