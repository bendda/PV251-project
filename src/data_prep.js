var satellite = require('satellite.js');
const data_orig = require('./space_data.json'); 
//const fs = require('fs');



export function calculatePositions(data) {
 
    //const data = JSON.parse(JSON.stringify(data_orig)); 

    for (let index = 0; index < data.length; index++) {
        const object = data[index];
    
        // get TLE data
        var tleLine1 = object["TLE_LINE1"]
        var tleLine2 = object["TLE_LINE2"]

        //console.log(index)

        // Initialize a satellite record
        var satrec = satellite.twoline2satrec(tleLine1, tleLine2);
        //console.log(satrec)

      
    
        
    
        // Get the position of the satellite at the given date
        const date = new Date();
        const positionAndVelocity = satellite.propagate(satrec, date);
 
        const gmst = satellite.gstime(date);



        try {
          const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
          object.lng = satellite.degreesLong(position.longitude);
          object.lat = satellite.degreesLat(position.latitude);
          object.alt = position.height / 1000;
          object.radius = Math.random() * 5;
          object.color = ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)];
        }
        catch (err) {
          data.splice(index, 1);
          continue;

        }
    
    }
    
    return data;
}


// const processedData = JSON.stringify(processData([...data_orig]))

// // write JSON string to a file
// fs.writeFile('processed_data.json', processedData, (err) => {
//   if (err) {
//       throw err;
//   }
//   console.log("JSON data is saved.");
// });





