import React from 'react';
import {connect} from 'react-redux';
import {withGoogleMap, GoogleMap, Circle, Marker} from "react-google-maps";
import { checkClickForCopper } from '../../Helpers/GeoHelpers';
import StyledGameMap from "./StyledGameMap.json";

const GameMap = withGoogleMap(props => (

    <GoogleMap
        center={props.center}
        defaultZoom={17}
        defaultCenter={props.center}
        ref={(map) => map ? props.mapCallBack(map) : {}}
        //onDragEnd={() => props.onDragEnd()}
        onIdle={() => props.onDragEnd()}
/*        onClick={
            event => {
                checkClickForCopper(event.latLng.lng(), event.latLng.lat(), props.dispatch);
            }}*/
        options={{
            mapTypeControl: false,
            streetViewControl: false,
            clickableIcons: false,
            zoomControl: false,
            draggable: true,
            scrollwheel: false,
            panControl: false,
            //maxZoom: 18,
            //minZoom: 18,
            //zoom: 18,
            styles: StyledGameMap,
            disableDefaultUI: true,
            disableDoubleClickZoom: true,
            
        }}
        

    >



        <Circle
            onClick={
                event => {
                checkClickForCopper(event.latLng.lng(), event.latLng.lat(), props.dispatch);
            }}
            center={props.center}
            radius={100}
            options={{
                fillColor: `green`,
                fillOpacity: 0.20,
                strokeColor: `black`,
                strokeOpacity: 0.50,
                strokeWeight: 2,
                 
            }}
        />

        <Marker
            defaultPosition={props.center}
            position={props.center}
            title="Click to zoom"
            icon={{url: '/images/racoon.png',
                scaledSize: {width: 40, height: 40},
                size: {width: 360, height: 330},
                anchor: {x:20, y:20}

            }}
            onClick={
                event => {
                    checkClickForCopper(event.latLng.lng(), event.latLng.lat(), props.dispatch);
                }}
        />

    </GoogleMap>
));

export default connect()(GameMap);