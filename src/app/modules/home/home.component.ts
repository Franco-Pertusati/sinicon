import { Component, input, model } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { RadioOption, PrtRadioComponent } from '../../prt-ui/prt-radio/prt-radio.component';
import { PrtButton } from "../../prt-ui/prt-button/prt-button.component";
import { CurrentShiftComponent } from "./routes/current-shift/current-shift.component";
import { HistoryComponent } from "./routes/history/history.component";

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, ToolbarComponent, PrtRadioComponent, PrtButton, CurrentShiftComponent, HistoryComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  selectedPage = model<string>('1')
  radioOptions: RadioOption[] = [
    {
      value: '1',
      label: 'Turno Actual',
      icon: 'home'
    },
    {
      value: '2',
      label: 'Historial',
      icon: 'history'
    },
    {
      value: '3',
      label: 'Vinos',
      icon: 'wine_bar'
    }
  ]
}
