import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core'
import { Position } from '@capacitor/geolocation'
import { AlertController, ModalController } from '@ionic/angular'
import { LocationStorageService } from '../../services/location-storage/location-storage.service'
import * as maplibreGl from 'maplibre-gl'
import { TranslateService } from '@ngx-translate/core'
import { BehaviorSubject } from 'rxjs'

enum MapSource {
  locations = 'locations-source',
}

enum MapLayer {
  locations = 'locations-layer',
  locationsHeatmap = 'locations-heatmap-layer',
}

@Component({
  selector: 'lib-privacy-history',
  templateUrl: './privacy-configuration-history.component.html',
  styleUrls: ['./privacy-configuration-history.component.scss'],
})
export class PrivacyConfigurationHistoryComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>

  private map: maplibreGl.Map | undefined
  private locations: Position[] = []

  fromDate: Date = new Date()
  toDate: Date = new Date()
  isHeatmapActive: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(
    false
  )

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
    private modalController: ModalController,
    private alertController: AlertController,
    private translateService: TranslateService
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
    this.isHeatmapActive.subscribe(() => this.toggleHeatmap())
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
      MapSource.locations
    ) as maplibreGl.GeoJSONSource
    if (locationSource) {
      locationSource.setData(locationData)
    } else {
      this.map?.addSource(MapSource.locations, {
        type: 'geojson',
        data: locationData,
      })
    }

    if (!this.map?.getLayer(MapLayer.locations)) {
      this.map?.addLayer({
        id: MapLayer.locations,
        type: 'circle',
        source: MapSource.locations,
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

  private toggleHeatmap() {
    if (this.isHeatmapActive.value) {
      this.map?.addLayer({
        id: MapLayer.locationsHeatmap,
        type: 'heatmap',
        source: MapSource.locations,
        maxzoom: 9,
        paint: {
          // Increase the heatmap weight based on frequency and property magnitude
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'mag'],
            0,
            0,
            6,
            1,
          ],
          // Increase the heatmap color weight weight by zoom level, heatmap-intensity is a multiplier on top of heatmap-weight
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            1,
            9,
            3,
          ],
          // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
          // Begin color ramp at 0-stop with a 0-transparancy color to create a blur-like effect.
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(33,102,172,0)',
            0.2,
            'rgb(103,169,207)',
            0.4,
            'rgb(209,229,240)',
            0.6,
            'rgb(253,219,199)',
            0.8,
            'rgb(239,138,98)',
            1,
            'rgb(178,24,43)',
          ],
          // Adjust the heatmap radius by zoom level
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
          // Transition from heatmap to circle layer by zoom level
          'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0],
        },
      })
    } else if (this.map?.getLayer('locations-heatmap')) {
      this.map?.removeLayer('locations-heatmap')
    }
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

  async onDeleteLocationClick(location: Position) {
    const alert = await this.alertController.create({
      header: this.translateService.instant(
        'simport-location-privacy-toolkit.location-history.deleteDialogTitle'
      ),
      buttons: [
        {
          text: this.translateService.instant(
            'simport-location-privacy-toolkit.general.cancel'
          ),
        },
        {
          text: this.translateService.instant(
            'simport-location-privacy-toolkit.general.delete'
          ),
          role: 'destructive',
          handler: () => {
            this.locationStorageService.deleteLocation(location)
            const index = this.locations.indexOf(location, 0)
            if (index > -1) {
              this.locations.splice(index, 1)
            }
          },
        },
      ],
    })

    await alert.present()
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
