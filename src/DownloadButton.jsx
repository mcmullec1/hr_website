import './App.css'
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import download from "/download.png"

function DownloadButton({colours, overallSessionData, startTime, stopTime}) {

    //define the column names for the data
    const header_names = [
        'timeInterval',
        'hr',
        'name',
        'id'
      ];

    //to convert object data to CSV format by delimiting
    function jsonToCSV(data, header_names) {

        if (data.length === 0) {return '';}

        const headers = header_names.join(',') + '\n';

        //join data in correct header order with commas, then end with new line
        const rows = data.map((row) => {
            return header_names.map((item) => String(row[item]) || '').join(',');
            })
            .join('\n');

        return headers + rows;
      }


    //function to run when download button is clicked
    const handleDownload = (data, header_names) => {

        //if no stop time
        if(stopTime == ''){
          stopTime = new Date()
        }

        let filtered_data = data.filter(x => {
          return ((new Date(x.timeInterval) > startTime) && (new Date(x.timeInterval)< stopTime));
        });
        console.log("THIS IS THE FILTERED DATA")
        console.log(filtered_data)

        //get CSV string data
        const csv_data = jsonToCSV(filtered_data, header_names);


        //if no data alert
        if (csv_data === '') {
          alert('Export failed.');
        }

        
        //create CSV item with blob, create link on page and click it to download, then remove
        else {

          const blob = new Blob([csv_data], { type: 'text/csv;charset=utf-8;' });
          
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.setAttribute('download', 'heartrate_data.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
    }

    return (
        <>
        <button className='download_button' onClick={() => handleDownload(overallSessionData, header_names)}>
          <Box
            height="100%"
            width="100%"
            backgroundColor={colours["light_green"]}
            borderRadius="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              component="img"
              sx={{height: "30px",}}
              alt="Download symbol."
              src={download}
            ></Box>
          </Box>
        </button>
            
        </>
    )
}
    
export default DownloadButton