import { Box, Button, FormControl, InputLabel, MenuItem, Select, Slider } from '@mui/material';
import { fontFamily, fontWeight } from '@mui/system';
import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import './App.css';
// import { calculatePositions } from './data_prep';
const data_orig = require('./space_data.json');
var satellite = require('satellite.js');

// const processed_data = calculatePositions([...data_orig])
//const processed_data = require('./processed_data.json')

function calculatePositions(data, date) {
 
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

const processed_data = calculatePositions([...data_orig])




const countryCodes = new Set(processed_data.map((object) => {
  return object["COUNTRY_CODE"]
}))


const objectTypes = new Set(processed_data.map((object) => {
  return object["OBJECT_TYPE"]
}))





function filterCountry(country, data) {
  if (country === "ALL") {
    return data
  }

  return data.filter((object) => {
    return object["COUNTRY_CODE"] === country
  })

}

function filterType(type, data) {

  if (type === "ALL") {
    return data
  }

  return data.filter((object) => {
    return object["OBJECT_TYPE"] === type
  })

}


// function filterLaunchDate(launchDate, data) {

//   if (launchDate === 0) {
//     return data
//   }

//   return data.filter((object) => {
//     return object["LAUNCH_DATE"] === launchDate
//   })

// }


// timeline filtering
function filterTimeLine(yearFrom, yearTo, data) {
  return data.filter((object) => {
    return object["LAUNCH_DATE"] >= yearFrom && object["LAUNCH_DATE"] <= yearTo
  })

}


function applyFilters(country, type,  year, data) {
  const country_applied = filterCountry(country, data)
  const type_applied = filterType(type, country_applied)
  // const date_applied = filterLaunchDate(launchDate, type_applied)
  return filterTimeLine(year[0], year[1], type_applied)


}










function App() {


  const globeEl = useRef();
  const [data, setData] = useState([]);
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [test, setTest] = useState("")
  const [country, setCountry] = useState("PRC")
  const [objectType, setObjectType] = useState("PAYLOAD")
  const [size, setSize] = useState("")
  const [launchDate, setLaunchDate] = useState(2021)
  const [year, setYear] = useState([1961,2021])


  useEffect(() => {
    setData(applyFilters(country, objectType,  year, processed_data))
    console.log("useeffect")
  }, [country, objectType,  year])


  const handleFilter = () => {
    setData(applyFilters(country, objectType,  year, processed_data))
    //setData2(applyFilters(country, objectType,  processed_data))
  }

  // useEffect(() => {
  //   (function moveSpheres() {
  //     data.forEach(d => d.lat += 0.2);
  //     setData(data.slice());
  //     requestAnimationFrame(moveSpheres);
  //   })();
  // }, []);

  // useEffect(() => {
  //   globeEl.current.pointOfView({ altitude: 3.5 });
  // }, []);





  return (

    <Box position="relative"
      height="100%"

    >


      <Box
        style={{ backgroundColor: "black", backgroundColor: 'transparent' }}
        position="absolute"
        top={10}
        width={200}
        height={800}
        zIndex={10}
        display={"flex"}
        flexDirection={'column'}
        alignItems={"center"}

      >



        <FormControl sx={{ m: 1, minWidth: 150 }}>
          <InputLabel id="country-code" style={{ color: "white" }} >Country Code</InputLabel>
          <Select labelId="country-code" label="Country code" value={country} sx={{ color: "white", "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" } }} onChange={(event) => { setCountry(event.target.value) }} >
            <MenuItem value="ALL">
              <em>ALL</em>
            </MenuItem>
            {
              [...countryCodes].sort().map((item) => {
                return (<MenuItem value={item}>{item}</MenuItem>)
              })

            }
          </Select>
        </FormControl>


        <FormControl sx={{ m: 1, minWidth: 150 }}>
          <InputLabel id="object-type" style={{ color: "white" }}>Object Type</InputLabel>
          <Select labelId="object-type" label="Object type" value={objectType} sx={{ color: "white", "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" } }} onChange={(event) => { setObjectType(event.target.value) }} >
            <MenuItem value="ALL">
              <em>ALL</em>
            </MenuItem>
            {
              [...objectTypes].map((item) => {
                return (<MenuItem value={item}>{item}</MenuItem>)
              })
            }
          </Select>
        </FormControl>

        {/* <FormControl sx={{ m: 1, minWidth: 150 }}>
          <InputLabel id="launch-date" style={{ color: "white" }}>Launch Date</InputLabel>
          <Select labelId="launch-date" label="Launchdate" value={launchDate} sx={{ color: "white", "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" } }} onChange={(event) => { setLaunchDate(parseInt(event.target.value)) }} >
            <MenuItem value="0">
              <em>ALL</em>
            </MenuItem>
            {
              [...Array(61).keys()].map(i => i + 1961).map((item) => {
                return (<MenuItem value={item}>{item}</MenuItem>)
              })
            }
          </Select>
        </FormControl> */}


        {/* <Button variant="contained" onClick={handleFilter}>Apply Filters</Button> */}
        <Box
          paddingTop={10}
          paddingLeft={5}
          height={800}
        >

          <Slider
            aria-label="Temperature"
            defaultValue={year}
            valueLabelDisplay="on"
            step={1}
            marks={[...Array(61).keys()].filter((item) => {
              return ((item % 10 === 0) || (item === 60))
            }).map(i => i + 1961).map((item) => {
              return ({
                value: item,
                label: item
              })
            })}
            min={1961}
            max={2021}
            orientation="vertical"
            onChange={(event) => { setYear(event.target.value) }}
            sx={{
              '& .MuiSlider-markLabel': {
                color: "white",
                fontSize: 15,
                fontWeight: "500"
              },
              '& .MuiSlider-valueLabel': {

                fontSize: 12,
                fontWeight: '500',
                top: 23,
                left: -56,
                '&:before': {
                  display: 'none',
                },
              },
              '& .MuiSlider-mark': {
                backgroundColor: '#bfbfbf',
                height: 2,
                width: 0.5,
                '&.MuiSlider-markActive': {
                  opacity: 1,
                  backgroundColor: 'currentColor',
                },
              },
              '& .MuiSlider-track': {
                border: 'none',
              },
              '& .MuiSlider-rail': {
                opacity: 0.5,
                backgroundColor: '#bfbfbf',
              },
            }}

          />
        </Box>


      </Box>



      {/* <Box
          //  style={{ backgroundColor: "black" }} 
          position="absolute"
          bottom={15}
          zIndex={10}
          width={1000}
          marginLeft={"-500px"}
          left="50%"
          
        >
         
        </Box> */}









      <Box height="100%">
        <Globe
          // height={1080}
          ref={globeEl}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

          customLayerData={data}
          customLayerLabel={(object) => { return ` <b>${object.OBJECT_NAME}</b> <br /> ${object.OBJECT_ID}` }}

          customThreeObject={d => new THREE.Mesh(
            new THREE.SphereBufferGeometry(d.radius),
            new THREE.MeshLambertMaterial({ color: d.color })
          )}
          customThreeObjectUpdate={(obj, d) => {
            Object.assign(obj.position, globeEl.current.getCoords(d.lat, d.lng, d.alt));

          }}
          onCustomLayerClick={(obj, event) => {
            console.log(event)
            setTest(JSON.stringify(obj["OBJECT_NAME"]))
            setPos({ x: event["screenX"], y: event["screenY"] })
          }}
        />
      </Box>


    </Box>






  );
}

export default App;


