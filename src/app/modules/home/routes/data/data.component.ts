import { Component, model } from '@angular/core';
import { RadioOption, PrtRadioComponent } from '../../../../prt-ui/prt-radio/prt-radio.component';
import { WaiterListComponent } from "../../components/waiter-list/waiter-list.component";
import { WineListComponent } from "../../components/wine-list/wine-list.component";

@Component({
  selector: 'app-data',
  imports: [PrtRadioComponent, WaiterListComponent, WineListComponent],
  templateUrl: './data.component.html'
})
export class DataComponent {
  selectedPage = model<string>('1')
  radioOptions: RadioOption[] = [
    {
      value: '1',
      label: 'Mozos',
      icon: 'person'
    },
    {
      value: '2',
      label: 'Vinos',
      icon: 'wine_bar'
    }
  ]
}
