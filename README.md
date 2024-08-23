# Real-Time Display of Heartrate Monitor Data ♥️

The goal of this project is to provide a platform to access and view live heart-rate data from multiple Bluetooth enabled heart rate monitors. This project serves as my MSc Project at the University of Roehampton.

#### Files:

##### App.jsx
- handles the time interval to coordinate data storing in child components
- stores overall session data in an object
- includes HTML for header, including the download button

##### Monitors.jsx
- includes HTML to render grid of child "Monitor" components

##### Monitor.jsx
- handles connection to heartrate monitoring devices using the Web Bluetooth API
- recieves heartrate values and stores data in state variables
- includes HTML for a "Monitor" card that prompts a user to connect to a device and then view live heartrate data from the corresponing device

##### DownloadButton.jsx
- handles converting the JSON object data to CSV format and writing this data to a downloadable CSV file
- includes HTML for the download button

##### main.jsx
- renders App.jsx

##### index.html
- runs main.jsx script

##### App.css & index.css
- includes CSS styling for both App.jsx and index.html

##### deploy.yml
- to build and deploy the website via GitPages
- code from https://github.com/sitek94/vite-deploy-demo/tree/main#readme


