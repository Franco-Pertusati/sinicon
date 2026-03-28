import { Component, inject } from '@angular/core';
import { ThemeToggleBtnComponent } from "../../../../prt-ui/theme-toggle-btn/theme-toggle-btn.component";
import { ShiftService } from '../../../../core/services/shift.service';
import { WineService } from '../../../../core/services/wine.service';

@Component({
  selector: 'app-toolbar',
  imports: [ThemeToggleBtnComponent],
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent {
  shift = inject(ShiftService)
  wine = inject(WineService)

  ngOninit() {}
}
