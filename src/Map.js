import React, { Component } from 'react';
import * as FoursquareAPI from './FoursquareAPI';

class Map extends Component {
    state = {
        myMap: {},
        markers: [],
        infoWindow: {}
    }

    componentWillMount() {
        let bodyEl = document.querySelector('body');
        let mapEl = document.createElement('div');
        mapEl.id = 'map';
        bodyEl.appendChild(mapEl);
        //create script tag for google maps api
        let scriptEl = document.createElement('script');
        scriptEl.async = true;
        scriptEl.defer = true;
        scriptEl.src = `https://maps.googleapis.com/maps/api/js?key=${this.props.mapKey}&v=3&callback=initMap`;
        bodyEl.appendChild(scriptEl);
        window.initMap = this.initMap;
    }

    // Initializes map with info window and adds listeners to markers
    initMap = () => {
        const mapWindow = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: this.props.home.lat, lng: this.props.home.lng },
            zoom: 10
        });

        const infoWindow = new window.google.maps.InfoWindow({
            maxWidth: 170
        });
        this.setState({infoWindow}, (() =>
            this.setState({myMap: mapWindow}, ( () => {
                //Add markers
                const locations = this.props.locations;
                const theMap = this.state.myMap
                const bounds = new window.google.maps.LatLngBounds();
                let markers = locations.map((loc, i) => {
                    const marker = new window.google.maps.Marker({
                        map: theMap,
                        position: loc.location,
                        title: loc.name,
                        animation: window.google.maps.Animation.DROP,
                        id: loc.id
                    });
                    bounds.extend(marker.position);
                    marker.addListener('click', () => {
                        this.populateInfoWindow(marker, infoWindow, theMap);
                    });
                    return marker
                })
                theMap.fitBounds(bounds);
                this.setState({markers});
            }))
        ))
    }

    // Add/Remove marker animations
    isSelected = (marker) => {
        const selectedLoc = this.props.selectedLocation;
        const infoWindow = this.state.infoWindow;
        if(marker.id === selectedLoc.id){
            this.populateInfoWindow(marker, infoWindow, this.state.myMap);
            return window.google.maps.Animation.BOUNCE
        }
        return null
    };

    // Call Foursquare API and populate the info window with data
    populateInfoWindow = (marker, infoWindow, theMap) =>{
        infoWindow.setContent('Loading...');
        FoursquareAPI.getVenueDetails(marker.id)
            .then(venue => {
                const vDetails = venue.response.venue
                const infoContent = this.buildInfoWindowContent(vDetails);
                infoWindow.setContent(infoContent);
                infoWindow.open(theMap, marker);
            })
            .catch(err => {
                infoWindow.setContent(`<div><span>There was an error loading this venue's info</span><p>Error: ${err}</p></div>`)
                infoWindow.open(theMap, marker);
            })
    };


    buildInfoWindowContent = (vDetails) => {
        let content = '<div class="info-window">'
        content += vDetails.name ? `<h3>${vDetails.name}</h3>` : '';
        content += vDetails.categories[0].name ? `<h4>${vDetails.categories[0].name}</h4>` : '';
        content += vDetails.description ? `<h5>${vDetails.description}</h5>` : '';
        content += vDetails.bestPhoto.prefix && vDetails.bestPhoto.suffix ? `<img src="${vDetails.bestPhoto.prefix}150x90${vDetails.bestPhoto.suffix}" alt="${vDetails.name} Image" class="info-window-pic">` : '';
        content += '<p><ul>'
        content += vDetails.contact.formattedPhone && vDetails.hours.status ? `<li>Phone: ${vDetails.contact.formattedPhone} ${vDetails.hours.status}</li>` : '';
        content += vDetails.rating && vDetails.likes.summary ? `<li class="rating">Rating: ${vDetails.rating} with ${vDetails.likes.summary}</li>` : '';
        content += vDetails.menu && vDetails.price.message ? `<li><a href="${vDetails.menu.url}">Menu</a> Price: ${vDetails.price.message}</li>` : '';
        content += vDetails.canonicalUrl && vDetails.url ? `<li><a href="${vDetails.canonicalUrl}">Open on Foursquare</a>, <a href="${vDetails.url}>Home Page</a></li>` : '';
        content += '</p></ul></div>'
        return content;
    };

    render() {
        const {filteredLocations} = this.props;
        const markers = this.state.markers
        let filteredMarkers = markers.filter(mk => {
            mk.setMap(null);
            return filteredLocations.some(loc => loc.id === mk.id)
        })

        return (
            <div className="map">
                {
                    filteredMarkers.forEach( mk => {
                        mk.setAnimation(this.isSelected(mk));
                        mk.setMap(this.state.myMap);
                    })
                }
            </div>
        );
    }
}

export default Map
