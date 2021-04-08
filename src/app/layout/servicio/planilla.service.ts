import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanillaService {


  baseUrl:any='http://138.128.245.244:8445/infosweb/api/v1/rrhh/planilla/';


  constructor(private http:HttpClient) {



  }

  guardarPlanilla(objeto:any):Observable<any>{
    return this.http.post(this.baseUrl+'crear-programacion-pla',objeto);
  }

obtenerPlanillas(mes:any,anio:any):Observable<any>{
    return this.http.get('http://138.128.245.244:8445/infosweb/api/v1/rrhh/planilla/programacion-by-anio-mes/3/'+anio+'/'+mes);
  }



  obtenerResumen(mes:any,anio:any,tipo:any,num:any):Observable<any>{
    return this.http.get(this.baseUrl+'find-resumen-by-programacion-pla/'+'3/'+anio+'/'+mes+'/'+tipo+'/'+num);
  }




}
