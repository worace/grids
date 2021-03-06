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
      center: [-118.2437, 34.0522],
      kRing: 0
    }
  };

  lat() { return this.state.center[1]; }
  lon() { return this.state.center[0]; }
  res() { return this.state.resolution; }

  h3Index() {
    return h3.geoToH3(this.lat(), this.lon(), this.res());
  }

  cellGeoJson(index) {
    const bounds = h3.h3ToGeoBoundary(index);
    bounds.push(bounds[bounds.length - 1].slice(0));
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
        <div ref={mc => this.mapContainer = mc} className="mapbox-container" />
        <div className="sidebar">
          <p>
            <span>Grid Type: {this.state.gridType}</span>
          </p>
          <p>
            <span>Resolution: {this.state.resolution}</span>
          </p>
          <p>
            <span>Lat/Lon: {this.lat()}, {this.lon()}</span>
          </p>
          <p>
            <span>Resolution:
              <input onChange={this.resolutionUpdated.bind(this)}
                     value={this.state.resolution}
                     type="range"
                     min="0"
                     max="15"
                     step="1" />
            </span>
          </p>
          <p>
            <span>kRing:
              <input onChange={this.kRingUpdated.bind(this)}
                     value={this.state.kRing}
                     type="range"
                     min="0"
                     max="10"
                     step="1" />
            </span>
          </p>
          <p>
            <span>Current Cell: {this.h3Index()}</span>
          </p>
          <p>
            Cells
          </p>
          <ul className="cellList">{this.cellListItems()}</ul>
        </div>
        </div>
    );
  }
  cellListItems() {
    return this.activeCells().map(c => {
      return (
        <li key={c}>{c}</li>
      )
    });
  }

  componentDidUpdate() {
    this.updateMapSource();
  }

  kRingUpdated(event) {
    this.setState({kRing: event.target.value});
  }

  resolutionUpdated(event) {
    this.setState({resolution: event.target.value});
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v9',
      zoom: 16,
      center: this.state.center
    });
    this.map.on('load', this.mapLoaded.bind(this));
    this.map.on('click', this.mapClicked.bind(this));
  }

  activeCells() {
    return h3.kRing(this.h3Index(), this.state.kRing);
  }

  cellsSourceData() {
    const features = this.activeCells().map(this.cellGeoJson)
    return {type: 'FeatureCollection',
            features: features};
  }

  updateMapSource() {
    this.map.getSource('cells').setData(this.cellsSourceData());
  }

  mapLoaded() {
    console.log('*** Map Loaded ***');
    this.map.addSource('cells',
                       {type: 'geojson',
                        data: this.cellsSourceData()});

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

  mapClicked(event) {
    const {lng, lat} = event.lngLat;
    this.setState({center: [lng, lat]});
    this.updateMapSource();
  }
}

export default App;
