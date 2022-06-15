import { NgModule } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { PrivacyConfigurationComponent } from './privacy-configuration/privacy-configuration.component'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { PrivacyConfigurationDetailComponent } from './privacy-configuration/privacy-configuration-detail/privacy-configuration-detail.component'
import { IonicModule } from '@ionic/angular'
import { PrivacyConfigurationOptionComponent } from './privacy-configuration/privacy-configuration-options/privacy-configuration-options.component'

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../src/assets/i18n/', '.json')
}

@NgModule({
  declarations: [
    PrivacyConfigurationComponent,
    PrivacyConfigurationDetailComponent,
    PrivacyConfigurationOptionComponent,
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
      isolate: true,
    }),
  ],
  exports: [PrivacyConfigurationComponent],
})
export class PrivacyToolkitModule {}
