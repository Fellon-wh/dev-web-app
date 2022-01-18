import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportTemplateComponent } from './pages/Report/ReportTemplate.component';
import { SokobanComponent } from './pages/Sokoban/Sokoban.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: 'sokoban', component: SokobanComponent },
  { path: 'report', component: ReportTemplateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }