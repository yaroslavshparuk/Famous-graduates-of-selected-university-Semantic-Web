import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GraduatesComponent } from './graduates/graduates.component';
import { UniversitiesComponent } from './universities/universities.component';

@NgModule({
  imports: [RouterModule.forRoot([
    {path: 'universities', component: UniversitiesComponent},
    {path: '', redirectTo: '/universities', pathMatch: 'full'},
    {path: 'graduates/:universityName', component: GraduatesComponent},
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
