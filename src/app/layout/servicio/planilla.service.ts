import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanillaService {

  constructor(private http:HttpClient) { 



  }



  obtenerPlanillas():Observable<any>{
    return this.http.get('http://138.128.245.244:8445');
  }
}
