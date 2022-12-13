import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, map, Observable, Subject } from 'rxjs';
import { UrlExtensions } from '../helpers/url-extensions';
import { Graduate } from '../models/graduate';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'graduates',
  templateUrl: './graduates.component.html',
  styleUrls: ['./graduates.component.scss']
})
export class GraduatesComponent implements OnInit {
  public graduates: Observable<Graduate[]> | undefined;
  private universityName: string = '';
  public filter = new FormControl('', { nonNullable: true });
  public showPolitics$ = new BehaviorSubject(false);
  public searchByDiscipline: string = '';
  public searchByDisciplineUpdate$ = new Subject<string>();
  constructor(
    private api: ApiService,
    private router: Router) { }

  ngOnInit(): void {
    this.universityName = UrlExtensions.takeLast(this.router.url);
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
    // this.showPolitics$.subscribe((value: boolean) => {
    //   if(value){
    //     this.graduates = this.graduates?.pipe(
    //       map((x: Graduate[]) => x.filter(y => !!y.party))
    //     )
    //   }
    //   else {
    //     this.graduates = this.api.getGraduates(this.universityName);
    //   }
    // });
  }
}
