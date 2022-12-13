import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import { Extensions } from '../helpers/extensions';
import { University } from '../models/university';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'universities',
  templateUrl: './universities.component.html',
  styleUrls: ['./universities.component.scss']
})
export class UniversitiesComponent implements OnInit {
  public universities: Observable<University[]> | undefined;
  public filterByCountry: string = '';
  public filterByCountryUpdate$ = new Subject<string>();
  constructor(
    private api: ApiService,
    private route: Router) { }

  ngOnInit(): void {
    this.universities = this.api.getUniversities();
    this.filterByCountryUpdate$.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        if(value == ''){
          this.universities = this.api.getUniversities();
        }
        else{
          this.universities = this.api.getUniversitiesByCountry(value);
        }
      });
  }

  goToUniversity(name: string){
    this.route.navigate(['/graduates', Extensions.takeLastInURL(name)]);
  }
}
