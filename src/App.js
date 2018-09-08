import React, { Component } from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import h3 from 'h3-js';

const mapboxToken = 'pk.eyJ1Ijoid29yYWNlIiwiYSI6ImNqbHR1OXpvMjA0MWwza2xpeGp6ODk5NG8ifQ.U_Hnl80dqIsQJknQtC6CVQ';
mapboxgl.accessToken = mapboxToken;

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      gridType: "h3",
      resolution: 9,
      center: [-118.2437, 34.0522]
    }
  };

  lat() { return this.state.center[1]; }
  lon() { return this.state.center[0]; }
  res() { return this.state.resolution; }

  h3Index() {
    return h3.geoToH3(this.lat(), this.lon(), this.res());
  }

  cellGeoJson() {
    const bounds = h3.h3ToGeoBoundary(this.h3Index());
    console.log('size');
    console.log(bounds.length);
    console.log("push back");
    console.log(bounds[bounds.length - 1])
    bounds.push(bounds[bounds.length - 1].slice(0));
    console.log('size');
    console.log(bounds.length);
    const coords = bounds.forEach(b => b.reverse());
    return {type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [bounds]
            }};
  }

  render() {
    return (
      <div>
        <div className="header">
          <p>
            <span>Grid Type: {this.state.gridType}</span>
            <span>Resolution: {this.state.resolution}</span>
            <span>Lat/Lon: {this.lat()}, {this.lon()}</span>
            <span>Current Cell: {this.h3Index()}</span>
          </p>
        </div>
        <div ref={mc => this.mapContainer = mc} className="mapbox-container" />
        </div>
    );
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v9',
      zoom: 16,
      center: this.state.center
    });
    this.map.on('load', this.mapLoaded.bind(this))
  }

  mapLoaded() {
    console.log('*** Map Loaded ***');
    console.log(this.cellGeoJson());
    this.map.addSource('cells',
                       {type: 'geojson',
                        data: this.cellGeoJson()});
    console.log(JSON.stringify(this.cellGeoJson()));
    this.map.addLayer({
      id: 'cells-fill',
      type: 'fill',
      source: 'cells',
      paint: {
        'fill-color': '#ff0000',
        'fill-opacity': 0.6
      }
    });
  }
}

export default App;
