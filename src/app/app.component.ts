import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastListComponent } from "./prt-ui/prt-toast/toast-list/toast-list.component";
import { DialogContainerComponent } from "./prt-ui/prt-dialog/dialog-container/dialog-container.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastListComponent, DialogContainerComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'sinicon';
}
