import { convertPoint } from './CoordinateConverter';
import {searchForCopper, searchDone, displayRoofNotFound, displayRoofTaken, displayRoofNotTaken} from '../Redux/Actions/copperMapActions';
import base from '../Firebase/base';

export const geoError = (err) => {
    console.warn('ERROR(' + err.code + '): ' + err.message);
}

export const geoOptions = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 4500
}


const convertFromTextToXML = (textToConvert) => {
        const parser = new DOMParser();
        const textToReturn = parser.parseFromString(textToConvert, 'text/xml');
        return (textToReturn);
}

const createObjectFromXML = (xml) => {
    return{
        id: xml.getElementsByTagName('id')[0].childNodes[0].nodeValue,
        area: xml.getElementsByTagName('area')[0].childNodes[0].nodeValue 
        }
}


export const checkClickForCopper = (long, lat, dispatch, firebase) => {

    const sthlmPointUrlTemplate = 'https://us-central1-coppercors.cloudfunctions.net/copperProvider/?whatcopper=Geom=POINT(%longitude%%20%latitude%)';
    const [x,y] = convertPoint(long, lat);
    dispatch(searchForCopper());

    fetch(createUrl(sthlmPointUrlTemplate, x, y), { method: 'GET'} )
    .then( response => response.status === 200 ? Promise.resolve(response) : Promise.reject(new Error(response.statusText)))
    .then( response => response.text())
    .then( text => convertFromTextToXML(text))
    .then( parsedXML => {
        dispatch(searchDone());
        if (parsedXML.getElementsByTagName('dataEntitity')[0].getAttribute('resultRecords') === '1') {
            let roof = createObjectFromXML(parsedXML);
        base.fetch('stolenRoofs', {
            context: {},
            queries: {
                orderByChild: 'roofId',
                equalTo: roof.id},
                then(response){
                if(Object.keys(response).length){
                    dispatch(displayRoofTaken(roof))
                }
                else{
                    dispatch(displayRoofNotTaken(roof))
                }
            }
        })}
        
        else {
           dispatch(displayRoofNotFound());
        }


    });
}


function createUrl(templateURL, long, lat) {
    var queryURL = templateURL.replace('%longitude%', long);
    queryURL = queryURL.replace('%latitude%', lat);
    return queryURL;
}