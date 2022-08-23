import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core'
import { Position } from '@capacitor/geolocation'
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular'
import { LocationStorageService } from '../../services/location-storage/location-storage.service'
import * as maplibreGl from 'maplibre-gl'
import { TranslateService } from '@ngx-translate/core'
import { BehaviorSubject } from 'rxjs'

enum MapSource {
  locations = 'locations-source',
}

enum MapLayer {
  locations = 'locations-layer',
  locationsLine = 'locations-line-layer',
  locationsHeatmap = 'locations-heatmap-layer',
}

enum MapMode {
  dot = 'dot',
  line = 'line',
  heat = 'heat',
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

  // lazy loaded list
  private static LIST_CHUNK_SIZE = 20
  lazyLoadedLocations: Position[] = []
  private lazyLoadedPage = 0

  locations: Position[] = []
  currentLocations: Position[] = []
  fromDate: Date | undefined
  toDate: Date | undefined
  mapMode: BehaviorSubject<MapMode> = new BehaviorSubject<MapMode>(MapMode.dot)
  showDemoData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(
    private locationStorageService: LocationStorageService,
    private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private translateService: TranslateService
  ) {}

  async ngOnInit() {
    this.mapMode.subscribe(() => this.updateMapMode())
    this.showDemoData.subscribe(async () => {
      await this.loadLocations()
      this.updateLocationsOnMap()
    })
  }

  ngAfterViewInit() {
    this.map = new maplibreGl.Map({
      container: this.mapContainer.nativeElement,
      style: `https://demotiles.maplibre.org/style.json`,
      center: [0, 0],
      zoom: 0,
    })
    this.map?.on('load', () => {
      this.map?.resize()
      if (this.currentLocations.length) {
        this.updateLocationsOnMap()
      } else {
        this.map?.flyTo({
          center: [0, 0],
          zoom: 0,
        })
      }
    })
  }

  private async loadLocations() {
    const loading = await this.loadingController.create({
      message: this.translateService.instant(
        'simportLocationPrivacyToolkit.locationOption.history.loadingLocationsTitle'
      ),
    })
    loading.present()

    this.locations = this.showDemoData.value
      ? await this.locationStorageService.getExampleLocations()
      : await this.locationStorageService.getAllLocations()

    loading.dismiss()

    this.lazyLoadedLocations = []
    this.lazyLoadedPage = 0
    if (this.locations.length) {
      const newFromDate = new Date(
        Math.min(...this.locations.map((o) => o.timestamp))
      )
      const newToDate = new Date(
        Math.max(...this.locations.map((o) => o.timestamp))
      )
      this.currentLocations = this.locations.filter(
        (l) =>
          l.timestamp >= newFromDate.getTime() &&
          l.timestamp <= newToDate.getTime()
      )
      this.fromDate = newFromDate
      this.toDate = newToDate
      this.lazyLoadLocations()
    } else {
      this.currentLocations = []
      this.fromDate = undefined
      this.toDate = undefined
    }
  }

  private lazyLoadLocations() {
    const startIndex =
      this.lazyLoadedPage * PrivacyConfigurationHistoryComponent.LIST_CHUNK_SIZE
    const endIndex =
      startIndex + PrivacyConfigurationHistoryComponent.LIST_CHUNK_SIZE
    if (startIndex < this.currentLocations.length) {
      const locationsChunk = this.currentLocations.slice(startIndex, endIndex)
      this.lazyLoadedLocations.push(...locationsChunk)
      this.lazyLoadedPage += 1
    }
  }

  // map methods

  private updateLocationsOnMap() {
    const locationFeatures: GeoJSON.Feature[] = this.currentLocations.map(
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
    const pointCoordinates = locationFeatures.map(
      (p) => (p.geometry as GeoJSON.Point).coordinates
    )
    const lineFeature: GeoJSON.Feature = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: this.currentLocations.map((l) => [
          l.coords.longitude,
          l.coords.latitude,
        ]),
      },
      properties: {},
    }
    locationFeatures.push(lineFeature)
    const locationData: GeoJSON.GeoJSON = {
      type: 'FeatureCollection',
      features: locationFeatures,
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

    this.fitBoundsTo(pointCoordinates)
    this.updateMapMode()
  }

  private updateMapMode() {
    if (!this.map?.loaded) return
    switch (this.mapMode.value) {
      case MapMode.heat: {
        this.togglePointsLayer(false)
        this.toggleHeatMapLayer(true)
        this.toggleLineMapLayer(false)
        break
      }
      case MapMode.line: {
        this.togglePointsLayer(false)
        this.toggleHeatMapLayer(false)
        this.toggleLineMapLayer(true)
        break
      }
      default: {
        this.togglePointsLayer(true)
        this.toggleHeatMapLayer(false)
        this.toggleLineMapLayer(false)
        break
      }
    }
  }

  private togglePointsLayer(showLayer: boolean) {
    const hasPointsLayer = this.map?.getLayer(MapLayer.locations)
    if (showLayer && !hasPointsLayer) {
      this.map?.addLayer({
        id: MapLayer.locations,
        type: 'circle',
        source: MapSource.locations,
        paint: {
          'circle-radius': 3,
          'circle-color': '#B42222',
        },
        filter: ['==', '$type', 'Point'],
      })
    } else if (!showLayer && hasPointsLayer) {
      this.map?.removeLayer(MapLayer.locations)
    }
  }

  private toggleHeatMapLayer(showLayer: boolean) {
    const hasHeatmapLayer = this.map?.getLayer(MapLayer.locationsHeatmap)
    if (showLayer && !hasHeatmapLayer) {
      this.map?.addLayer({
        id: MapLayer.locationsHeatmap,
        type: 'heatmap',
        source: MapSource.locations,
        maxzoom: 20,
        paint: {
          // Increase the heatmap weight based on frequency and property magnitude
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'mag'],
            0,
            0,
            0.01,
            1,
          ],
          // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
          // Begin color ramp at 0-stop with a 0-transparancy color to create a blur-like effect.
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(33,102,172, 0)',
            0.05,
            'rgba(33,102,172, 0.25)',
            0.2,
            'rgba(103,169,207,0.5)',
            0.4,
            'rgba(209,229,240,0.75)',
            0.6,
            'rgba(250,231,105,0.85)',
            0.8,
            'rgba(240,159,79,0.9)',
            0.9,
            'rgba(227,108,34,0.9)',
            1,
            'rgb(178,24,43)',
          ],
          // Adjust the heatmap radius by zoom level
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 20, 10],
        },
      })
    } else if (!showLayer && hasHeatmapLayer) {
      this.map?.removeLayer(MapLayer.locationsHeatmap)
    }
  }

  private toggleLineMapLayer(showLayer: boolean) {
    const hasLineLayer = this.map?.getLayer(MapLayer.locationsLine)
    if (showLayer && !hasLineLayer) {
      this.map?.addLayer({
        id: MapLayer.locationsLine,
        type: 'line',
        source: MapSource.locations,
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#944040',
          'line-width': 2,
        },
        filter: ['in', '$type', 'LineString'],
      })
    } else if (!showLayer && hasLineLayer) {
      this.map?.removeLayer(MapLayer.locationsLine)
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

  // callbacks

  onLoadLocationListChunk(event: any) {
    this.lazyLoadLocations()
    event.target.complete()
  }

  async onCloseClick() {
    await this.modalController.dismiss()
  }

  async onDeleteLocationClick(location: Position) {
    const alert = await this.alertController.create({
      header: this.translateService.instant(
        'simportLocationPrivacyToolkit.locationOption.history.deleteDialogTitle'
      ),
      buttons: [
        {
          text: this.translateService.instant(
            'simportLocationPrivacyToolkit.general.cancel'
          ),
        },
        {
          text: this.translateService.instant(
            'simportLocationPrivacyToolkit.general.delete'
          ),
          role: 'destructive',
          handler: () => {
            if (!this.showDemoData.value) {
              // only remove real location data from storage
              this.locationStorageService.deleteLocation(location)
            }
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

  onMapModeChanged(newMode: string) {
    const newMapMode = newMode as keyof typeof MapMode
    if (newMapMode) {
      this.mapMode.next(MapMode[newMapMode])
    }
  }

  // helpers

  mapModeKeys(): Array<string> {
    return Object.keys(MapMode)
    //return keys.slice(keys.length / 2, keys.length - 1)
  }

  getIconForMapMode(mode: MapMode | string): string {
    switch (mode) {
      case MapMode.dot:
        return 'map-outline'
      case MapMode.heat:
        return 'thermometer-outline'
      case MapMode.line:
        return 'analytics'
      default:
        return ''
    }
  }
}
