import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Box from '@mui/material/Box';
import './App.css'
import EditableLabel from "react-inline-editing";

function Monitor({timeInterval, colours, sendData, id}) {

    //variable for connectivity, if a device is currently connected
    const [connected, setConnected] = useState('Not Connected')
    
    //variable for current heartrate value
    const [hr, setHR] = useState(0);

    //variable for chart heartrate data
    const [hrData, setHrData] = useState(new Array(200).fill(0))
    
    //variable for connected device name
    const [deviceName, setDeviceName] = useState("N/A")

    //variable for session data to pass to App for download
    const [sessionData, setSessionData] = useState({})

    //current connected device given name, can be updated to user preference
    const [name, setName] = useState("P"+(id+1))

    //current minimum heartrate to display
    const [min, setMin] = useState(0)

  
    //runs every time the time interval changes
    useEffect(()=>{
        //if a valid time interval, update session data with new time interval and hr
        if(timeInterval != null){
            let newSessionData = sessionData
            newSessionData[timeInterval.toString()] = hr
            setSessionData(newSessionData)

            let sum = 0;
            Object.values(sessionData).forEach( num => {sum += num;})
            if(sum != 0){
                setMin(Math.min.apply(Math, Object.values(sessionData).filter(Boolean)))
            }
        }
        // send the new data to App to add to the overall session data
        console.log(name)
        sendData({"timeInterval":timeInterval.toString(), "hr":hr,"name":name, "id":id+1}, id)

    }, [timeInterval]);


    //function that runs every time the hr broadcast changes
    function handleHrChange(event){

        //clean the hr
        let value = event.target.value;
        let heartrate = value.getUint8(1);

        let newData = hrData
        newData[newData.length] = heartrate
        newData = newData.slice(-200)

        //update hr and chart values
        setHrData(newData)
        setHR(heartrate)

    }


    //connection function, runs when the connect button is clicked
    async function toConnect() {

        //use Bluetooth Web API to prompt popup of devices
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['heart_rate'] }],
            acceptAllDevices: false,
            optionalServices: ['battery_service'],
            })
        
        //connect to device and update connection variables
        const server = await device.gatt.connect()
        setConnected("Connected")
        setDeviceName(device.name)

        //handle disconnection
        device.addEventListener('gattserverdisconnected', () => {
            setConnected("Disconnected");
            setHR(0)
            setHrData(new Array(200).fill(0))
            });

        //get heartrate characteristic broadcast
        const service = await server.getPrimaryService('heart_rate')
        const char = await service.getCharacteristic('heart_rate_measurement')
        char.startNotifications()
        char.addEventListener('characteristicvaluechanged', handleHrChange)


    }

    //for display update colours based on connectivity
    let connected_text = colours["pink"]
    if(connected == "Connected"){
        connected_text = colours["light_green"]
    }

    //for display update view if device connected
    let connect_display = "none"
    if(connected != "Connected"){
        connect_display = "flex"
    }


    return (
        <>
        {/* Monitor card */}
        <Box
            width={345}
            height={315}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-around"
            color={colours["dark_green"]}
            backgroundColor="white"
            borderRadius={20}
            zIndex={1}
            position="relative"
        >
            {/* Connect button popup */}
            <Box
                width={345}
                height={315}
                position="absolute"
                zIndex={99}
                backgroundColor = "white"
                borderRadius={20}
                display={connect_display}
                alignItems="center"
                justifyContent="center"
            >
                <button
                    onClick={() => toConnect()}
                    className='connect_button'

                >CONNECT</button>
            </Box>
        
            {/* Once connected, metrics view */}
            <Box
                height="25%"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                zIndex={1}
            >
                <p className='bpm_num'>{hr}</p>
            </Box>

            <Box fontSize="10pt">MIN: {min} BPM</Box>

            <Box
                height="35%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                zIndex={1}
            >
                <LineChart skipAnimation

                    yAxis={[
                    {
                        min: 50,
                        max: 200,
                    },
                    ]}  
                    series={[
                    {
                        data: hrData,
                        area: true,
                        showMark: false,
                        color: colours["light_green"]
                    },
                    ]}
                    bottomAxis={null}
                    grid={{ horizontal: true }}
                    width={375}
                    height={250}
                />
            </Box>

            <Box
                height="30%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-around"
                zIndex={1}
            >
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                >
                    <Box
                        borderRadius="100%"
                        width="10px"
                        height="10px"
                        backgroundColor={Object.values(colours)[id]}
                        margin="10px"
                    ></Box>


                    <EditableLabel
                        text={name}
                        labelClassName="nameLabel"
                        inputClassName="nameInput"
                        inputWidth="200px"
                        inputHeight="25px"
                        inputMaxLength={20}
                        onFocusOut={setName}
                    />
                   

                    <Box
                        height= "15px"
                        width="15px"
                        margin="5px"
                    ></Box>
                </Box>
                <Box>{deviceName}</Box>
                <Box
                    color={connected_text}
                >{connected}</Box>
            </Box>

        </Box>
        </>
    )
}
    
export default Monitor
    