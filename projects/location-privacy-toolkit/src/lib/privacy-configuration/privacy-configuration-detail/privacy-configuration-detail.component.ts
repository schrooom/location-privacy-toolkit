import { Component, Input } from '@angular/core'
import { ModalController } from '@ionic/angular'

@Component({
  selector: 'privacy-configuration.detail',
  templateUrl: './privacy-configuration-detail.component.html',
  styleUrls: ['./privacy-configuration-detail.component.scss'],
})
export class PrivacyConfigurationDetailComponent {
  @Input() title: string = ''
  @Input() subtitle: string = ''
  @Input() description: string = ''
  @Input() detailDescription: string = ''
  @Input() icon: string = ''
  @Input() iconClass: string = ''

  constructor(private modalController: ModalController) {}

  async onCloseClick() {
    await this.modalController.dismiss()
  }
}
