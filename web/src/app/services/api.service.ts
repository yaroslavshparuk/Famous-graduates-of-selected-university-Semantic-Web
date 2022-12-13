import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { University } from '../models/university';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly BASE: string = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  getUniversities(): Observable<University[]> {
    return this.http.get<University[]>(this.BASE + '/universities')
  }
}
