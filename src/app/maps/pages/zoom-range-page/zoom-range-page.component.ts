import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

import { LngLat, Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.css']
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map')
  public divMap?: ElementRef;

  public zoom: number = 10;

  public map?: Map;

  public currentLngLat: LngLat = new LngLat(-74.5, 40);

  ngAfterViewInit(): void {

    console.log(this.divMap);

    if (!this.divMap) throw 'El elemento HTML no fue encontado';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat,
      zoom: this.zoom, // starting zoom
    });

    this.mapListeners();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  mapListeners(): void {
    if (!this.map) throw 'Mapa no inicializado';

    this.map.on('zoom', () => {
      this.zoom = this.map!.getZoom();
    });

    this.map.on('zoomend', () => {
      if (this.map!.getZoom() < 18) return;
      this.map?.zoomTo(18);
    });

    this.map.on('move', () => {
      this.currentLngLat = this.map!.getCenter();

//      const { lng, lat } = this.currentLngLat;
//      console.log({lng, lat});
    });
  }

  zoomIn(): void {
    this.map?.zoomIn();
  }

  zoomOut(): void {
    this.map?.zoomOut();
  }

  zoomChanged(value: string): void {
    this.zoom = Number(value);
    this.map?.zoomTo(this.zoom);
  }
}
