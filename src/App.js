import './App.css';
import Globe from 'react-globe.gl';
import React from 'react';
import {useState, useEffect, useRef} from 'react';
import * as THREE from 'three';
import {Select, InputLabel, FormControl, Button, Box, Slider} from '@mui/material';
// import InputLabel from '@mui/material/InputLabel';
// import FormControl from '@mui/material/FormControl';


import { MenuItem, Fab } from '@mui/material';
import { calculatePositions } from './data_prep';
const data_orig = require('./space_data.json');
const processed_data = calculatePositions([...data_orig])
//const processed_data = require('./processed_data.json')



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

  return data.filter((object)=>{
      return object["COUNTRY_CODE"] === country
  })

}

function filterType(type, data) {

  if (type === "ALL") {
    return data
  }

  return data.filter((object)=>{
      return object["OBJECT_TYPE"] === type
  })

}


function filterLaunchDate(launchDate, data) {

  if (launchDate === 0) {
    return data
  }

  return data.filter((object)=>{
      return object["LAUNCH_DATE"] === launchDate
  })

}


function applyFilters(country, type, launchDate, data) {
  const country_applied = filterCountry(country, data)
  const type_applied = filterType(type, country_applied)
  const date_applied = filterLaunchDate(launchDate, type_applied)
  return date_applied


}




// timeline filtering
function filterTimeLine(year, data) {
  return data.filter((object)=>{
      return object["LAUNCH_DATE"] <= year
  })

}




function App() {


    const globeEl = useRef();
    const [data, setData] = useState(applyFilters("PRC", "PAYLOAD", 2021, processed_data));
    const [data2, setData2] = useState(applyFilters("PRC", "PAYLOAD", 2021, processed_data));



    const [pos, setPos] = useState({x: 0, y: 0})
    const [test, setTest] = useState("")
    const [country, setCountry] = useState("PRC")
    const [objectType, setObjectType] = useState("PAYLOAD")
    const [size, setSize] = useState("")
    const [launchDate, setLaunchDate] = useState(2021)


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
  
    <>
    {/* <div style={{backgroundColor:"red",width:"50px",left:pos.x, top:pos.y}}>
      {test}
    </div> */}

     

     {/* <form onSubmit={(e) => { 
        e.preventDefault()
        setData(filterCountry(country))
                              console.log(data.length)
                              console.log(filterCountry(country).length)
                              console.log(country) }}>
        <label>
          Select country code:
          
          <Select label="Country code" value={country} onChange={(event) => { setCountry(event.target.value)} } >
            {
              [...countryCodes].map( (item) => {
                 return (<MenuItem value={item}>{item}</MenuItem>)
              } )
            }
          </Select>
          
        </label>
        <input type="submit" value="Submit" />
      </form> */}


      {/* <form onSubmit={(e) => { 
        e.preventDefault()
        setData(filterType(objectType))
                              console.log(data.length)
                              console.log(filterType(objectType).length)
                              console.log(objectType) }}>
        <label>
          Select object type:
          
          <Select label="Object type" value={objectType} onChange={(event) => { setObjectType(event.target.value)} } >
            {
              [...objectTypes].map( (item) => {
                 return (<MenuItem value={item}>{item}</MenuItem>)
              } )
            }
          </Select>
          
        </label>
        <input type="submit" value="Submit" />
      </form> */}


      {/* <form onSubmit={(e) => { 
        e.preventDefault()
        setData(filterLaunchDate(launchDate))
                              console.log(filterLaunchDate(launchDate).length)
                              console.log(launchDate) }}>
        <label>
          Select launch date:
          
          <Select label="Launchdate" value={launchDate} onChange={(event) => { setLaunchDate(parseInt(event.target.value))}} >
            
          {
              [...Array(61).keys()].map(i => i + 1961).map( (item) => {
                 return (<MenuItem value={item}>{item}</MenuItem>)
              } )
          }
              
          </Select>
          
        </label>
        <input type="submit" value="Submit" />
      </form> */}

        <Box style={{backgroundColor:"black"}} p={2}>

        <FormControl sx={{ m: 1, minWidth: 150}}>
        <InputLabel id="country-code" style={{color:"white"}} >Country Code</InputLabel>
          <Select labelId="country-code" label="Country code" value={country} sx={{color:"white", "& .MuiOutlinedInput-notchedOutline": {borderColor: "white"}}}  onChange={(event) => { setCountry(event.target.value)} } >
            <MenuItem value="ALL">
              <em>ALL</em>
            </MenuItem>
            {
              [...countryCodes].sort().map( (item) => {
                 return (<MenuItem value={item}>{item}</MenuItem>)
              } )
              
            }
          </Select>
          </FormControl>

          
          <FormControl sx={{ m: 1, minWidth: 150 }}>
          <InputLabel id="object-type" style={{color:"white"}}>Object Type</InputLabel>
          <Select labelId="object-type" label="Object type" value={objectType} sx={{color:"white", "& .MuiOutlinedInput-notchedOutline": {borderColor: "white"}}} onChange={(event) => { setObjectType(event.target.value)} } >
            <MenuItem value="ALL">
              <em>ALL</em>
            </MenuItem>
            {
              [...objectTypes].map( (item) => {
                 return (<MenuItem value={item}>{item}</MenuItem>)
              } )
            }
          </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 150 }}>
          <InputLabel id="launch-date" style={{color:"white"}}>Launch Date</InputLabel>
          <Select labelId="launch-date" label="Launchdate" value={launchDate} sx={{color:"white", "& .MuiOutlinedInput-notchedOutline": {borderColor: "white"}}} onChange={(event) => { setLaunchDate(parseInt(event.target.value))}} >
            <MenuItem value="0">
              <em>ALL</em>
            </MenuItem>
            {
                [...Array(61).keys()].map(i => i + 1961).map( (item) => {
                   return (<MenuItem value={item}>{item}</MenuItem>)
                } )
            }   
          </Select>
          </FormControl>


          <Button variant="contained" onClick={() => {
            setData(applyFilters(country, objectType, launchDate, processed_data))
            setData2(applyFilters(country, objectType, launchDate, processed_data))
            console.log(country)
            console.log(objectType)
            console.log(launchDate)
          }}>Apply Filters</Button>


          <Slider
            aria-label="Temperature"
            defaultValue={30}
            
            
            
            valueLabelDisplay="on"
            

            step={5}
            marks
            min={1961}
            max={2021}

            onChange={(event) => { setData(filterTimeLine(event.target.value, data2)); console.log(data2) }}

            
          />

          </Box>
      


      




     

    
      


    <Globe
    ref={globeEl}
    globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

    customLayerData={data}
    customLayerLabel={(object) => { return  ` <b>${object.OBJECT_NAME}</b> <br /> ${object.OBJECT_ID}`}}
    
    customThreeObject={d => new THREE.Mesh(
      new THREE.SphereBufferGeometry(d.radius),
      new THREE.MeshLambertMaterial({ color: d.color })
    )}
    customThreeObjectUpdate={(obj, d) => {
      Object.assign(obj.position, globeEl.current.getCoords(d.lat, d.lng, d.alt));
      
    }}

    

  
  
    
    onCustomLayerClick={(obj, event)=>{
      console.log(event)
      setTest(JSON.stringify(obj["OBJECT_NAME"]))
      setPos({x: event["screenX"], y: event["screenY"]})
    }}
    />


    </>

  


  

  );
}

export default App;


