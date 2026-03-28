import { Routes } from "@angular/router";
import { CurrentShiftComponent } from "./routes/current-shift/current-shift.component";
import { NoShiftComponent } from "./routes/no-shift/no-shift.component";

export const homeRoutes: Routes = [
  { path: 'turno', component: CurrentShiftComponent },
  { path: 'turno-cerrado', component: NoShiftComponent },
  { path: '', redirectTo: 'turno', pathMatch: 'full' }
];