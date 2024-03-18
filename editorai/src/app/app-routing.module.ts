import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PlaygroundComponent } from './components/playground/playground.component';

const routes: Routes = [
  { path: '', redirectTo: 'playground',   pathMatch: 'full' },
  { path: 'playground', component: PlaygroundComponent , data: { showHeader: true } },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
