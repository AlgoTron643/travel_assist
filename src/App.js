import React, { useState, useEffect } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import { getPlacesData} from './api';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';
//import PlaceDetails from './components/PlaceDetails/PlaceDetails';

// get list of places by passing it to the list of places in the places placeholder

// use redux/reactcontext for passing places variable to multiple components (>2)

// remove the coordinates dependency in the useEffect as autocomplete in Header and Map 
// changes coordinates

const App = () =>  {

    const [places, setPlaces] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [childClicked, setChildClicked] = useState(null);
    const [coordinates, setCoordinates] = useState({});
    const [bounds, setBounds] = useState({});
    
    const [isLoading, setIsLoading] = useState(false);

    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');

    // get user's latitude and longitude using built-in browser geo-location API
    useEffect(() => {
      navigator.geolocation.getCurrentPosition(({coords: { latitude, longitude }}) => {
          setCoordinates({lat: latitude, lng: longitude});
      });
    }, []);

    useEffect(() => {
        const filteredPlaces = places.filter((place)=> place.rating > rating);
        setFilteredPlaces(filteredPlaces);
    }, [rating,places]);
    
    useEffect(() => {
      if(bounds.sw && bounds.ne){  
        setIsLoading(true); 

        getPlacesData(type, bounds.sw, bounds.ne) 
            .then((data) => {
                setPlaces(data?.filter((place)=>place.name && place.num_reviews > 0));
                setFilteredPlaces([]); //Avoid refreshing upon filtering
                setIsLoading(false);
         })
       }  
    }, [type, bounds]);

    return (
        <>
            <CssBaseline/>
            <Header setCoordinates={setCoordinates}/>
            <Grid container spacing={3} style={{width: '100%'}}>
                 <Grid item xs={12} md={4}>
                     <List 
                          places={filteredPlaces.length ? filteredPlaces:places}
                          childClicked={childClicked}
                          isLoading={isLoading}
                          type={type}
                          setType={setType}
                          rating={rating}
                          setRating={setRating}
                     />
                 </Grid>
                 <Grid item xs={12} md={8}>
                     <Map
                        setChildClicked={setChildClicked}
                        setCoordinates={setCoordinates}
                        setBounds={setBounds}
                        coordinates={coordinates}
                        places={filteredPlaces.length ? filteredPlaces:places}
                     />
                 </Grid>
            </Grid>
        </>
    );
}

export default App;