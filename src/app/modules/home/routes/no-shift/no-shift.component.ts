import { Component, inject } from '@angular/core';
import { PrtButton } from "../../../../prt-ui/prt-button/prt-button.component";
import { ShiftService } from '../../../../core/services/shift.service';

@Component({
  selector: 'app-no-shift',
  imports: [PrtButton],
  templateUrl: './no-shift.component.html'
})
export class NoShiftComponent {
  shift = inject(ShiftService)

  startShift() {
    this.shift.openShift()
  }
}
