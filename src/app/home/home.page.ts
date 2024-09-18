import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point'; 
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mapView: MapView | any;
  userLocationGraphic : Graphic | any;
  selectedBasemap: string = "topo-vector";

  constructor () {}

  async ngOnInit() {
    this.initializeMap();
  }

  async initializeMap() {
    const map = new Map({
      basemap: this.selectedBasemap
    });

    this.mapView = new MapView({
      container: "container",
      map: map,
      zoom: 10, // Adjust the zoom level as needed
      // Do not set center here, we will set it later based on the user's location
    });

    let weatherServiceFL = new ImageryLayer({ url: WeatherServiceURL });
    map.add(weatherServiceFL);

    this.addWeatherPointMarkers();

    // Initial location update to center the map on the user's location
    this.updateUserLocationOnMap();

    // Update the user's location periodically
    setInterval(this.updateUserLocationOnMap.bind(this), 10000);
  }

  async changeBasemap() {
    if (this.mapView) {
      this.mapView.map.basemap = this.selectedBasemap;
    }
  }

  addWeatherPointMarkers() {
    // Create a point with the provided coordinates
    let customPoint1 = new Point({
      longitude: -110.6765, // Longitude for Medicine Hat
      latitude: 50.0417     // Latitude for Medicine Hat
    });

    let customPoint2 = new Point({
      longitude: -99.32598442282034, // Updated Longitude for the new point
      latitude: 38.87886033734784    // Updated Latitude for the new point
    });

    let customPoint3 = new Point({
      longitude: -104.6189, // Longitude for Regina
      latitude: 50.4452    // Latitude for Regina
    });
    
    let customPoint4 = new Point({
      longitude: -108.5007, // Longitude for Billings
      latitude: 45.7833     // Latitude for Billings
    });

    // Create a symbol for the points
    let markerSymbol = new SimpleMarkerSymbol({
      color: [255, 0, 0], // Red color
      size: '12px', // Size of the marker
      outline: {
        color: [255, 255, 255], // White outline
        width: 2
      }
    });

    // Create graphics and add them to the mapView
    let customGraphic1 = new Graphic({
      geometry: customPoint1,
      symbol: markerSymbol
    });

    let customGraphic2 = new Graphic({
      geometry: customPoint2,
      symbol: markerSymbol
    });

    let customGraphic3 = new Graphic({
      geometry: customPoint3,
      symbol: markerSymbol
    });

    let customGraphic4 = new Graphic({
      geometry: customPoint4,
      symbol: markerSymbol
    });

    // Remove the Kansas point
    this.mapView.graphics.removeAll();

    // Add the new graphics
    this.mapView.graphics.add(customGraphic1);
    this.mapView.graphics.add(customGraphic2);
    this.mapView.graphics.add(customGraphic3);
    this.mapView.graphics.add(customGraphic4);
  }

  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      });
    });
  }

  async updateUserLocationOnMap() {
    let latLng = await this.getLocationService();
    let geom = new Point({ latitude: latLng[0], longitude: latLng[1] });

    // Update the user's location graphic
    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    } else {
      this.userLocationGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol(),
        geometry: geom,
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }

    // Center the map on the user's location
    this.mapView.center = geom;
  }
}

const WeatherServiceURL = "https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer";


// export class HomePage implements OnInit {
//   private latitude: number | any;
//   private longitude: number | any;

//   constructor() {}

  //public async ngOnInit() {
  //   const position = await Geolocation.getCurrentPosition();
  //   this.latitude = position.coords.latitude;
  //   this.longitude = position.coords.longitude;

  //   const map = new Map({
  //     basemap: "topo-vector"
  //   });

  //   const view = new MapView({
  //     container: "container",
  //     map: map,
  //     zoom: 14,
  //     center: [this.longitude, this.latitude]
  //   });

  //   const point = new Point({
  //     longitude: this.longitude,
  //     latitude: this.latitude
  //   });

  //   // Simbol dengan efek berlapis
  //   const outerCircleSymbol = new SimpleMarkerSymbol({
  //     style: "circle",
  //     color: [255, 0, 0, 0.6], // Merah transparan
  //     size: "20px",
  //     outline: {
  //       color: [0, 0, 0], // Hitam
  //       width: 2
  //     }
  //   });

  //   const innerCircleSymbol = new SimpleMarkerSymbol({
  //     style: "circle",
  //     color: [0, 255, 0, 0.8], // Hijau transparan
  //     size: "12px",
  //     outline: {
  //       color: [255, 255, 255], // Putih
  //       width: 1
  //     }
  //   });

  //   const outerCircleGraphic = new Graphic({
  //     geometry: point,
  //     symbol: outerCircleSymbol
  //   });

  //   const innerCircleGraphic = new Graphic({
  //     geometry: point,
  //     symbol: innerCircleSymbol
  //   });

  //   view.when(() => {
  //     view.graphics.add(outerCircleGraphic);
  //     view.graphics.add(innerCircleGraphic);
  //   });
  // }
//}
