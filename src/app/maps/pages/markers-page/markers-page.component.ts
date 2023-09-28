import { Component, ElementRef, ViewChild } from '@angular/core';
import { Map, LngLat, Marker } from 'mapbox-gl';

interface MarkerAndColor {
  color: string,
  marker: Marker,
}

interface PlainMarker {
  color: string,
  lngLat: number[]
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent {

  @ViewChild('map')
  public divMap?: ElementRef;

  public markers: MarkerAndColor[] = [];

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
      zoom: 10, // starting zoom
    });

    this.readFromLocalStorage();

    /*    const marketHtml = document.createElement('div');
        marketHtml.innerHTML = 'Fernando Herrera';

        const marker = new Marker({
    //      color: 'red'
          element: marketHtml
        }).setLngLat( this.currentLngLat ).addTo(this.map);
        */
  }

  createMarker(): void {

    if (!this.map) return;

    const color = '#XXXXXX'.replace(/X/g, y => (Math.random() * 16 | 0).toString(16));
    const lngLat = this.map.getCenter();

    this.addMarker(lngLat, color);
  }

  addMarker(lngLat: LngLat, color: string): void {
    if (!this.map) return;

    const marker = new Marker({
      color: color,
      draggable: true

    })
      .setLngLat(lngLat)
      .addTo(this.map);

    let isDragged = false;

    marker.on('dragstart', () => {
      console.log("dragstart");
      isDragged = true;
    });
    marker.on('drag', () => {
      console.log('drag');
    });
    marker.on('dragend', () => {
      console.log('dragend');
      this.saveToLocalStorage();
    });


    marker.getElement().addEventListener('click', () => {
      if (isDragged) {
        isDragged = false;
        return;
      }
      console.log("click");
      this.flyTo(marker)
    });

    this.markers.push({ color, marker });

    this.saveToLocalStorage();
  }

  deleteMarker(index: number): void {
    this.markers[index].marker.remove();
    this.markers.splice(index, 1);
  }

  flyTo(marker: Marker): void {
    this.map?.flyTo({
      zoom: 14,
      center: marker.getLngLat(),
    });
  }

  saveToLocalStorage(): void {
    const plainMarkers: PlainMarker[] = this.markers.map(({ color, marker }) => {
      return {
        color,
        lngLat: marker.getLngLat().toArray(),
      }
    });

    console.log(plainMarkers);

    localStorage.setItem('plainMarkers', JSON.stringify(plainMarkers));
  }

  readFromLocalStorage(): void {

    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse(plainMarkersString);

    plainMarkers.forEach(({ color, lngLat }) => {

      const [lng, lat] = lngLat;
      const coords = new LngLat(lng, lat);

      this.addMarker(coords, color);
    });
  }
}
