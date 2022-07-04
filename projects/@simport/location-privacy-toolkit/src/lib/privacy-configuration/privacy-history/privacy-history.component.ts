import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core'
import { Position } from '@capacitor/geolocation'
import { ModalController } from '@ionic/angular'
import { LocationStorageService } from '../../location-storage/location-storage.service'
import * as maplibreGl from 'maplibre-gl'

@Component({
  selector: 'lib-privacy-history',
  templateUrl: './privacy-history.component.html',
  styleUrls: ['./privacy-history.component.scss'],
})
export class PrivacyHistoryComponent implements OnInit, AfterViewInit {
  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>

  private map: maplibreGl.Map | undefined
  private locations: Position[] = []

  fromDate: Date = new Date()
  toDate: Date = new Date()

  currentLocations(): Position[] {
    const fromTimestamp =
      this.fromDate?.getTime() ??
      Math.min(...this.locations.map((o) => o.timestamp))
    const toTimestamp =
      this.toDate?.getTime() ??
      Math.max(...this.locations.map((o) => o.timestamp))
    return this.locations.filter(
      (l) => l.timestamp >= fromTimestamp && l.timestamp <= toTimestamp
    )
  }

  constructor(
    private locationStorageService: LocationStorageService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.locations = await this.locationStorageService.getAllLocations()
    if (this.locations.length) {
      this.fromDate = new Date(
        Math.min(...this.locations.map((o) => o.timestamp))
      )
      this.toDate = new Date(
        Math.max(...this.locations.map((o) => o.timestamp))
      )
    }
  }

  ngAfterViewInit() {
    this.map = new maplibreGl.Map({
      container: this.mapContainer.nativeElement,
      style: `TODO: include style`,
      center: [0, 0],
      zoom: 0,
    })
    this.map?.on('load', () => {
      this.map?.resize()
      if (this.currentLocations().length) {
        this.updateLocationsOnMap()
      }
    })
  }

  private updateLocationsOnMap() {
    const pointFeatures: GeoJSON.Feature[] = this.currentLocations().map(
      (l) => {
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [l.coords.longitude, l.coords.latitude],
          },
          properties: {},
        }
      }
    )
    const locationData: GeoJSON.GeoJSON = {
      type: 'FeatureCollection',
      features: pointFeatures,
    }
    const locationSource = this.map?.getSource(
      'locations'
    ) as maplibreGl.GeoJSONSource
    if (locationSource) {
      locationSource.setData(locationData)
    } else {
      this.map?.addSource('locations', {
        type: 'geojson',
        data: locationData,
      })
    }

    if (!this.map?.getLayer('locations')) {
      this.map?.addLayer({
        id: 'locations',
        type: 'circle',
        source: 'locations',
        paint: {
          'circle-radius': 6,
          'circle-color': '#B42222',
        },
        filter: ['==', '$type', 'Point'],
      })
    }

    const coords = pointFeatures.map(
      (p) => (p.geometry as GeoJSON.Point).coordinates
    )
    this.fitBoundsTo(coords)
  }

  private fitBoundsTo(coordinates: number[][]) {
    if (coordinates.length) {
      const firstCoordinate: number[] = coordinates[0]
      var bounds = coordinates.reduce(function (bounds, coord) {
        return bounds.extend(coord as maplibreGl.LngLatLike)
      }, new maplibreGl.LngLatBounds(firstCoordinate, firstCoordinate))
      this.map?.fitBounds(bounds, {
        padding: 20,
      })
    }
  }

  async onCloseClick() {
    await this.modalController.dismiss()
  }

  onFromDateChanged(date: any) {
    if (typeof date == 'string') {
      this.fromDate = new Date(date)
      this.updateLocationsOnMap()
    }
  }

  onToDateChanged(date: any) {
    if (typeof date == 'string') {
      this.toDate = new Date(date)
      this.updateLocationsOnMap()
    }
  }
}
