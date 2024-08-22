import React from 'react';
import Monitor from './Monitor';
import Grid from '@mui/material/Grid';

function Monitors({monitor_count, timeInterval, colours, sendData}) {

    return (
        <>
        {/* Grid of Monitor components*/}
        <Grid 
            container
            width="100%"
            spacing={4}
            alignItems="center"
            justifyContent="space-around"
            >
            {/* Create a Monitor component for each number in monitor count and pass props */}
            {Array.from(Array(monitor_count).keys()).map((i, index) => {
                return (
                    <Grid item key={i}><Monitor timeInterval={timeInterval} colours={colours} sendData={sendData} id={i}/></Grid>
                );
            })}
        </Grid>
        </>
    )
}
    
export default Monitors
    