import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { University } from '../models/university';
import { Graduate } from '../models/graduate';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly BASE: string = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  getUniversities(): Observable<University[]> {
    return this.http.get<University[]>(this.BASE + '/universities')
  }

  getGraduates(universityName: string): Observable<Graduate[]> {
    return this.http.get<Graduate[]>(this.BASE + '/graduates/' + universityName)
  }

  getGraduatesByDiscipline(universityName: string, discipline: string): Observable<Graduate[]> {
    return this.http.get<Graduate[]>(this.BASE + '/graduates/' + universityName + '/' + discipline);
  }
}
