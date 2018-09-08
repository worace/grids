import React, { Component } from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';

const mapboxToken = 'pk.eyJ1Ijoid29yYWNlIiwiYSI6ImNqbHR1OXpvMjA0MWwza2xpeGp6ODk5NG8ifQ.U_Hnl80dqIsQJknQtC6CVQ';
mapboxgl.accessToken = mapboxToken;

class App extends Component {
  render() {
    return (
      <div>
        <h1>Hello World</h1>
        <div ref={mc => this.mapContainer = mc} className="mapbox-container" />
      </div>
    );
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9'
    });
  }
}

export default App;
