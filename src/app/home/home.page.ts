import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private latitude: number | any;
  private longitude: number | any;

  constructor() {}

  public async ngOnInit() {
    const position = await Geolocation.getCurrentPosition();
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;

    const map = new Map({
      basemap: "topo-vector"
    });

    const view = new MapView({
      container: "container",
      map: map,
      zoom: 14,
      center: [this.longitude, this.latitude]
    });

    const point = new Point({
      longitude: this.longitude,
      latitude: this.latitude
    });

    // Simbol dengan efek berlapis
    const outerCircleSymbol = new SimpleMarkerSymbol({
      style: "circle",
      color: [255, 0, 0, 0.6], // Merah transparan
      size: "20px",
      outline: {
        color: [0, 0, 0], // Hitam
        width: 2
      }
    });

    const innerCircleSymbol = new SimpleMarkerSymbol({
      style: "circle",
      color: [0, 255, 0, 0.8], // Hijau transparan
      size: "12px",
      outline: {
        color: [255, 255, 255], // Putih
        width: 1
      }
    });

    const outerCircleGraphic = new Graphic({
      geometry: point,
      symbol: outerCircleSymbol
    });

    const innerCircleGraphic = new Graphic({
      geometry: point,
      symbol: innerCircleSymbol
    });

    view.when(() => {
      view.graphics.add(outerCircleGraphic);
      view.graphics.add(innerCircleGraphic);
    });
  }
}
