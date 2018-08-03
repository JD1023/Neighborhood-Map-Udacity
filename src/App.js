import React from 'react';
import GoogleMaps from './Map'
import Search from './Search';
import Header from './Nav'


class App extends React.Component {
  constructor(props) {
    super(props)
    //Hard-coded locations, in production would fetch from a database
    this.state.locations = [
      { name: 'Cannibale Royale', id: '5336fe68498e18d7e65f5803', location: {lat: 52.367956, lng: 4.890283} },
      { name: 'd&a Hummus Bistro', id: '55523531498ee5528513f68e', location: {lat: 52.3784317, lng: 4.8826728} },
      { name: 'Foodware', id: '4b2b70bbf964a52067b624e3', location: {lat: 52.3688496, lng: 4.8819963} },
      { name: 'Omelegg', id: '55c10ee5498ecb81fe809f9d', location: {lat: 52.3517144, lng: 4.8915005} },
      { name: 'Bakhuys', id: '5305f11f11d2d3664fb633a2', location: {lat: 52.3610963, lng: 4.9068455} }
    ];

    this.state.filteredLocations = this.state.locations;
  }

  state = {
    locations: [],
    filteredLocations: [],
    selectedLocation: ''
  }

  // Update state of locations
  selectLocation = (location) => {
    if (location.id === this.state.selectedLocation.id) {
      this.setState({selectedLocation: ''});
    } else {
      this.setState({selectedLocation: location});
    }
  }

  // Filter and update state for filtered locations
  queryUpdate = (value) => {
    this.setState(currentState => {
      let filteredLocations = [];
      const curLocations = currentState.locations;
      if(value !== '') {
        filteredLocations = curLocations.filter(loc => {
          return loc.name.toLowerCase().includes(value.toLowerCase());
        })
      } else {
        filteredLocations = curLocations;
      }
      return({filteredLocations});
    });
  }

  render() {
    return (
        <div className = "container">
          <Header />
          <GoogleMaps
            locations={this.state.locations}
            filteredLocations={this.state.filteredLocations}
            selectedLocation={this.state.selectedLocation}
            mapKey={'AIzaSyBhVsrHf3_B56tyFoS6eWSeULUO2f1bUS4'}
            home={{ lat: 52.367956, lng: 4.890283}}
          />
          <Search
            locations={this.state.locations}
            filteredLocations={this.state.filteredLocations}
            selectedLocation={this.state.selectedLocation}
            selectLocation={this.selectLocation}
            queryUpdate={this.queryUpdate}
          />
        </div>
    );
  }
}

export default App;
