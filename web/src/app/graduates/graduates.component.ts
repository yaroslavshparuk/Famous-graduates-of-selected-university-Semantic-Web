import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import { Extensions } from '../helpers/extensions';
import { Graduate } from '../models/graduate';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'graduates',
  templateUrl: './graduates.component.html',
  styleUrls: ['./graduates.component.scss']
})
export class GraduatesComponent implements OnInit {
  public graduates: Observable<Graduate[]> | undefined;
  public universityName: string = '';
  public showPolitics$ = new BehaviorSubject(false);
  public searchByDiscipline: string = '';
  public searchByDisciplineUpdate$ = new Subject<string>();
  constructor(
    private api: ApiService,
    public router: Router) { }

  ngOnInit(): void {
    this.universityName = Extensions.takeLastInURL(this.router.url);
    this.graduates = this.api.getGraduates(this.universityName);
    this.searchByDisciplineUpdate$.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        if(value == ''){
          this.graduates = this.api.getGraduates(this.universityName);
        }
        else{
          this.graduates = this.api.getGraduatesByDiscipline(this.universityName, value);
        }
      });
  }
}
