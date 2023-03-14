# Location Privacy Toolkit by SIMPORT &middot; 

</br>

[![](https://github.com/schrooom/location-privacy-toolkit/blob/main/resources/simport_bmbf_logo.png)](https://simport.net/)

---

Location Privacy Toolkit, that can be included into Angular and Ionic based mobile apps. This toolkit is aimed to be used as a replacement for usual location APIs. The goal of this toolkit is to allow users to actively control and monitor, which data is used by an app. Furthermore users can set preferences to the usage of location data using fine-grained control mechanisms. This is part of the [SIMPORT][simport] project.

> **Status**: Released (V1) 

## Contents

- ### [Library Usage](#library-usage)
  - [Architecture](#architecture)
  - [API](#api)
  - [Example](#example)
- ### [License](#license)

## Library Usage

### API

The accessible API of the Location Privacy Toolkit is basically given by the following two elements.

#### Location Service

The `Location Service` provides the app with the usual interfaces to request location data. First and foremost it reveals access to the actual location data in two ways: A simple method for a one-time location data request.

```ts
getCurrentLocation(): Promise<Position | undefined>
```

and also request for continuous location updates by registering a simple listener including the ability to unregister it later on.

```ts
registerListener(callback: (location: Position | undefined) => void)
removeListener()
```

Additionally the `Location Service` provides the following helper methods for the access-status and request of location data.

```ts
canUseLocation(requestPermission: Boolean = false): Promise<Boolean>
needsLocationAccessRequest(): Promise<Boolean>
requestLocationAccess(): Promise<Boolean>
```

#### Location Configuration Component

The `Location Privacy Configuration Component` is a central component, that ultimately controls the output of the `Location Service`. This component is designed to be presented to the users of location based services. They can use it to define when, how and which location data is shared with the service.
In order to address various kinds of users, the `Location Privacy Configuration Component` comes in two modes: a `Expert Mode` and a `Simple Mode`.

##### Expert Mode

Using the expert mode users have a wide set of options at their hands to be able to manipulate which and how location data is shared with the underlying location based service. Each location privacy option is complemented by a detailed info-view, which educates users about the impact each setting potentially makes to the behaviour of the `Location Service`.

| Location Privacy Option      |           Options            |
| ---------------------------- | :--------------------------: |
| One-time location requests   |       Allow / Disallow       |
| Continuous location requests |       Allow / Disallow       |
| Accuracy                     | 0 / 100 / 500 / 1,000 meters |
| Interval                     |   0 / 1 / 10 / 30 minutes    |

##### Simple Mode

Using the simple mode users have a simple slider at hand that is used to control the `Location Privacy Configuration Component`. This form of interaction comes with 3 presets to use:

| Location Privacy Option |                          Effect                           |
| ----------------------- | :-------------------------------------------------------: |
| Privacy focus           | Maximum privacy setting at the expense of service quality |
| Balanced                |        Balance between privacy and service quality        |
| Service focus           |     Maximum service quality at the expense of privacy     |

##### Location History

Furthermore a location history view provides the user with the ability to view their location data on a map. Using various visualisations users can explore and comprehend the location data recorded about themselves.

<p align="center">
  <img src="https://github.com/schrooom/location-privacy-toolkit/blob/main/resources/playgrounds_toolkit_overview.png" width="25%">
  <img src="https://github.com/schrooom/location-privacy-toolkit/blob/main/resources/playground_toolkit_details.png" width="25%">
  <img src="https://github.com/schrooom/location-privacy-toolkit/blob/main/resources/playgrounds_toolkit_heatmap.png" width="25%">
</p>

### Architecture

<p align="center">
  <img src="https://github.com/schrooom/location-privacy-toolkit/blob/main/resources/architecture.png" width="85%">
</p>

The architecture used in this `Location Privacy Toolkit` is inspired by the following work of Mehrnaz Ataei: [_Location Data Privacy : Principles to Practice_](https://doi.org/10.6035/14123.2018.783210).

<p align="center">
  <img src="https://github.com/schrooom/location-privacy-toolkit/blob/main/resources/architecture-draft.png" width="60%">
</p>

### Example

In course of the project a sample app was created: [The Playground-Finder][playground-finder] is a simple app, that helps users to find playgrounds in their area. That app makes use of this Location Privacy Toolkit and can be seen as an example on how to integrate it.

## License

```
SIMPORT Location Privacy Toolkit
Copyright (c) 2022 Sitcom Lab
```

[Further information](LICENSE)

[simport]: https://simport.net/
[ionic]: https://ionicframework.com/
[ionic-cli]: https://ionicframework.com/docs/cli
[capacitor]: https://capacitorjs.com/
[angular]: https://angular.io/
[node]: https://nodejs.org/
[vscode]: https://code.visualstudio.com
[vscode-prettier]: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
[git]: https://git-scm.com
[playground-finder]: https://github.com/schrooom/playground-finder
