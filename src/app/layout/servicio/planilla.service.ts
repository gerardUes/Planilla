import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProgramacionPla } from '../formPlanilla/form-planilla/modeloPlanilla/ProgramacionPla';
import { ProgramacionPlaPK } from '../formPlanilla/form-planilla/modeloPlanilla/ProgramacionPlaPK';

@Injectable({
  providedIn: 'root'
})
export class PlanillaService {


  baseUrl:any='http://138.128.245.244:8445/infosweb/api/v1/rrhh/planilla/';

  private objetoPlanillaService:ProgramacionPla;


  constructor(private http:HttpClient) {

  }


  obtenerTotalesPlanilla(cia:any,anio:any,secuencia:any,tipo:any):Observable<any>{
    return this.http.get('http://138.128.245.244:8445/infosweb/api/v1/rrhh/planilla/total-planilla-by-programacion/'+cia+'/'+anio+'/'+secuencia+'/'+tipo);
  }

  obtenerHorasXtras(cia:any,anio:any,secuencia:any,tipo:any):Observable<any>{
    return this.http.get('http://138.128.245.244:8445/infosweb/api/v1/rrhh/planilla/horas-extras-by-programacion/'+cia+'/'+anio+'/'+secuencia+'/'+tipo);
  }

  guardarPlanilla(objeto:any):Observable<any>{
    return this.http.post(this.baseUrl+'crear-programacion-pla',objeto);
  }


  obtenerTiposPlanilla(cia:any,rol:any):Observable<any>{
    return this.http.get('http://138.128.245.244:8445/infosweb/api/v1/rrhh/planilla/tipos-pla-by-rol/'+cia+'/'+rol);
  }



obtenerPlanillas(mes:any,anio:any):Observable<any>{
    return this.http.get('http://138.128.245.244:8445/infosweb/api/v1/rrhh/planilla/programacion-by-anio-mes/3/'+anio+'/'+mes);
  }



  obtenerResumen(mes:any,anio:any,tipo:any,num:any):Observable<any>{
    return this.http.get(this.baseUrl+'find-resumen-by-programacion-pla/'+'3/'+anio+'/'+mes+'/'+tipo+'/'+num);
  }




  public get objetoPlanillaServicio() {
    return this.objetoPlanillaService;
  }

  public set objetoPlanillaServicio(val) {
    this.objetoPlanillaService = val;
  }



}
