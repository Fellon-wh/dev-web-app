import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportTemplateComponent } from './pages/Report/ReportTemplate.component';
import { SokobanComponent } from './pages/Sokoban/Sokoban.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/rootscope' },
  { path: 'rootscope', loadChildren: () => import('./pages/Scope/RootScope.module').then(m => m.RootScopeModule) },
  { path: 'sokoban', component: SokobanComponent },
  { path: 'report', component: ReportTemplateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }