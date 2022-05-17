import { NgModule } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { PrivacyConfigurationComponent } from './privacy-configuration/privacy-configuration.component'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { PrivacyConfigurationDetailComponent } from './privacy-configuration/privacy-configuration-detail/privacy-configuration-detail.component'
import { IonicModule } from '@ionic/angular'

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './../assets/i18n/', '.json')
}

@NgModule({
  declarations: [
    PrivacyConfigurationComponent,
    PrivacyConfigurationDetailComponent,
  ],
  imports: [
    IonicModule,
    FormsModule,
    BrowserModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [PrivacyConfigurationComponent],
})
export class LocationPrivacyToolkitModule {}
