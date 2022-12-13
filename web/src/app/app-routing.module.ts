import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraduatesComponent } from './graduates/graduates.component';
import { UniversitiesComponent } from './universities/universities.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([
    {path: '', component: UniversitiesComponent},
    {path: 'graduates/:universityName', component: GraduatesComponent},
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
