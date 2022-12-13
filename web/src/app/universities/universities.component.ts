import { Component, OnInit } from '@angular/core';
import { University } from '../models/university';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'universities',
  templateUrl: './universities.component.html',
  styleUrls: ['./universities.component.scss']
})
export class UniversitiesComponent implements OnInit {
  public universities: University[] = [];
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getUniversities().subscribe((x: University[]) => this.universities = x);
  }
}
