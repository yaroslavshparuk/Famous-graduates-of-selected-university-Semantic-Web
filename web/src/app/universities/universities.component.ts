import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UrlExtensions } from '../helpers/url-extensions';
import { University } from '../models/university';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'universities',
  templateUrl: './universities.component.html',
  styleUrls: ['./universities.component.scss']
})
export class UniversitiesComponent implements OnInit {
  public universities: University[] = [];
  constructor(
    private api: ApiService,
    private route: Router) { }

  ngOnInit(): void {
    this.api.getUniversities().subscribe((x: University[]) => this.universities = x);
  }

  goToUniversity(name: string){
    this.route.navigate(['/graduates', UrlExtensions.takeLast(name)]);
  }
}
