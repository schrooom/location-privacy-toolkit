import { Translation } from './i18n'

export const en: Translation = {
  language: 'en',
  translations: {
    simportLocationPrivacyToolkit: {
      general: {
        title: 'Location privacy',
        delete: 'Delete',
        cancel: 'Cancel',
      },
      options: {
        mode: {
          simple: 'simple mode',
          expert: 'expert mode',
        },
      },
      locationOption: {
        simple: {
          title: 'Service quality',
          subtitle: 'Choose to what degree your location data ',
          description:
            'Choose to what degree your location data is used by the underlying service. ',
          detailDescription:
            '<b>Privacy focus</b> provides the service with the bare minimum of location data, which might limit the features of the service.<br><b>Compromise</b> provides the service with a balanced amount of location data. Usually most of the features of services work mostly as intended.<br><b>Service focus</b> provides the service with the maximum amount of location data. All location-based features should work as intended, but the service potentially gains more location data from you than actually needed.',
          level0: 'privacy focus',
          level1: 'compromise',
          level2: 'service focus',
        },
        accuracy: {
          title: 'Accuracy',
          subtitle: 'How accurate is your shared location?',
          description:
            'With accuracy, you are able to determine the precision of your device location. The value for accuracy defines a radius, in which the retrieved location usually lays in. Therefore a higher value is more imprecise and potentially has the effect of degrading service quality, while improving your privacy.',
          detailDescription:
            'There are 4 accuracy-levels available:<br><b>as accurate as possible</b> always uses the best accuracy availabe on this device.<br><b>fairly accurate</b> accurate up to 100m, which is viable for most use cases.<br><b>coarse</b> accurate up to 500m, which is usable for coarse orientation.<br><b>very coarse</b> accurate up to 1km, which is usable for very coarse orientation.',
          level0: 'very coarse',
          level1: 'coarse',
          level2: 'fairly accurate',
          level3: 'as accurate as possible',
        },
        interval: {
          title: 'Interval',
          subtitle: 'How often is your location accessed?',
          description:
            "Using the interval you can determine, how often this app is able to retrieve a new location from your device. A higher value therefore leads to a less frequent retrieval of your devices location. Example: If you've set to 10 Minutes, this means a new location is at maximum retrieved every 10 Minutes. In the meantime the previously retrieved location is used, which of course it might up to 10 Minutes old, which could potentially degrade the service quality.",
          detailDescription:
            'There are 4 interval-levels available:<br><b>as frequent as possible</b> always uses the most recent location availabe on this device.<br><b>fairly frequent</b> requests new locations every minute.<br><b>infrequent</b> requests new locations every 10 minutes.<br><b>very infrequent</b> requests new locations every 30 minutes.',
          level0: 'very infrequent',
          level1: 'infrequent',
          level2: 'fairly frequent',
          level3: 'as frequent as possible',
        },
        punctualAccess: {
          title: 'Punctual locations',
          subtitle: 'Find locations when explicitly demanded',
          description:
            'This provides the underlying service with access to singular location requests, such as retrieving your location once to provide information in your area.',
          detailDescription: '',
        },
        continuousAccess: {
          title: 'Continuous locations',
          subtitle: 'Continuously use your current location, e.g. to navigate',
          description:
            'This provides the underlying service with access to continuous location requests, such as navigation alongside a calculated route.',
          detailDescription: '',
        },
        rating: {
          privacy: {
            shortTitle: 'privacy',
            title: 'Privacy',
            subtitle: 'How do your preferences affect your privacy?',
            description:
              'You have the ability to choose, which location data you want to share how. This has immediate effects on your personal privacy.',
            detailDescription:
              "<b class='icon-high'>high</b> best privacy, no vulnerable data is shared.<br><b>medium-high</b> moderate privacy, little vulnerable data is shared.<br><b>medium-low</b> low privacy, some vulnerable data is shared.<br><b>low</b> worst privacy, all vulnerable data is shared.",
          },
          quality: {
            shortTitle: 'service',
            title: 'Service quality',
            subtitle: 'How do your preferences affect the service quality?',
            description:
              'You have the ability to choose, which location data you want to share how. This has immediate effects on the quality of service our app can offer.',
            detailDescription:
              '<b>high</b> best service quality, all features working as intended.<br><b>medium-high</b> moderate service quality, most features nearly working as intended.<br><b>medium-low</b> low service quality, features working with reduced functionality.<br><b>low</b> worst service quality, features not working as intended.',
          },
        },
        history: {
          title: 'Location history',
          subtitle: 'Manage your locations',
          description:
            "Explore and manage your personal location history. Delete locations that you don't want to be used by the service anymore.",
          detailDescription:
            'Explore your location history by using various visualization modes and filter them by date. You can choose to delete each location.<br>Additionally a demo mode lets you explore these features in a sandbox environment without affecting your actual data.',
          deleteDialogTitle: 'Are you sure to delete this location?',
          demoDataTitle: 'demo',
          noLocationsMessage: 'There are no locations in your history.',
          loadingLocationsTitle: 'Loading locations …',
        },
        sharing: {
          title: 'Location sharing',
          subtitle: 'With whom to share your location data?',
          description: 'lorem ipsum …',
          detailDescription: 'lorem ipsum …',
        },
      },
    },
  },
}
