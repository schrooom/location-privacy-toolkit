import { NgModule } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { PrivacyConfigurationComponent } from './components/privacy-configuration/privacy-configuration.component'
import { TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { PrivacyConfigurationDetailComponent } from './components/privacy-configuration-detail/privacy-configuration-detail.component'
import { IonicModule } from '@ionic/angular'
import { PrivacyConfigurationOptionComponent } from './components/privacy-configuration-options/privacy-configuration-options.component'
import { PrivacyConfigurationHistoryComponent } from './components/privacy-configuration-history/privacy-configuration-history.component'

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

@NgModule({
  declarations: [
    PrivacyConfigurationComponent,
    PrivacyConfigurationDetailComponent,
    PrivacyConfigurationOptionComponent,
    PrivacyConfigurationHistoryComponent,
  ],
  imports: [IonicModule, FormsModule, BrowserModule, TranslateModule],
  exports: [PrivacyConfigurationComponent, TranslateModule],
})
export class PrivacyToolkitModule {}
