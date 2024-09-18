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
  userLocationGraphic: Graphic | any;
  selectedBasemap: string = "topo-vector";
  lastKnownPosition: Point | null = null;

  constructor() {}

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

    // Update the user's location periodically but without recentering the map
    setInterval(this.updateUserLocationOnMap.bind(this), 10000);
  }

  async changeBasemap() {
    if (this.mapView) {
      this.mapView.map.basemap = this.selectedBasemap;
    }
  }

  addWeatherPointMarkers() {
    // Define points and markers
    const points = [
      { longitude: -110.6765, latitude: 50.0417 }, // Medicine Hat
      { longitude: -99.32598442282034, latitude: 38.87886033734784 }, // Updated Point
      { longitude: -104.6189, latitude: 50.4452 }, // Regina
      { longitude: -108.5007, latitude: 45.7833 } // Billings
    ];

    const markerSymbol = new SimpleMarkerSymbol({
      color: [255, 0, 0], // Red color
      size: '12px', // Size of the marker
      outline: {
        color: [255, 255, 255], // White outline
        width: 2
      }
    });

    this.mapView.graphics.removeAll();

    points.forEach(point => {
      const customPoint = new Point({
        longitude: point.longitude,
        latitude: point.latitude
      });

      const customGraphic = new Graphic({
        geometry: customPoint,
        symbol: markerSymbol
      });

      this.mapView.graphics.add(customGraphic);
    });
  }

  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      }, (err) => reject(err));
    });
  }

  async updateUserLocationOnMap() {
    const [latitude, longitude] = await this.getLocationService();
    const newPoint = new Point({ latitude, longitude });

    // Update the user's location graphic
    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = newPoint;
    } else {
      this.userLocationGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol(),
        geometry: newPoint,
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }

    // Only recenter if the new position is significantly different
    if (!this.lastKnownPosition || this.isSignificantlyDifferent(newPoint, this.lastKnownPosition)) {
      this.mapView.center = newPoint;
      this.lastKnownPosition = newPoint;
    }
  }

  isSignificantlyDifferent(point1: Point, point2: Point): boolean {
    const threshold = 0.01; // Define a threshold for significant movement
    const distance = Math.sqrt(
      Math.pow(point1.latitude - point2.latitude, 2) +
      Math.pow(point1.longitude - point2.longitude, 2)
    );
    return distance > threshold;
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
