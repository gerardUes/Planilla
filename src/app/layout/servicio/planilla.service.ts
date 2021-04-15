import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ProgramacionPla } from '../formPlanilla/form-planilla/modeloPlanilla/ProgramacionPla';
import { ProgramacionPlaPK } from '../formPlanilla/form-planilla/modeloPlanilla/ProgramacionPlaPK';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PlanillaService {


  baseUrl:any='http://138.128.245.244:8445/infosweb/api/v1/rrhh/planilla/';

  private objetoPlanillaService:ProgramacionPla;


  constructor(private http:HttpClient) {

  }


  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }


  generarPlanillaSevice(objeto:any):Observable<any>{
    return this.http.post(this.baseUrl+'generar-planilla', objeto).pipe(catchError(this.handleError));
  }



  cerrarPlanillaSevice(objeto:any):Observable<any>{
    return this.http.post(this.baseUrl+'cerrar-planilla', objeto).pipe(catchError(this.handleError));
  }


  obtenerTotalesPlanilla(cia:any,anio:any,secuencia:any,tipo:any):Observable<any>{
    return this.http.get('http://138.128.245.244:8445/infosweb/api/v1/rrhh/planilla/total-planilla-by-programacion/'+cia+'/'+anio+'/'+secuencia+'/'+tipo);
  }


  obtenerDetalleDeducPresta(cia:any,anio:any,secuencia:any,tipo:any,codDp:any):Observable<any>{
    return this.http.get(this.baseUrl+'find-detalle-resumen-by-programacion-pla/'+cia+'/'+anio+'/'+secuencia+'/'+tipo+'/'+codDp);
  }



  obtenerHorasXtras(cia:any,anio:any,secuencia:any,tipo:any):Observable<any>{
    return this.http.get('http://138.128.245.244:8445/infosweb/api/v1/rrhh/planilla/horas-extras-by-programacion/'+cia+'/'+anio+'/'+secuencia+'/'+tipo);
  }

  guardarPlanilla(objeto:any):Observable<any>{
    return this.http.post(this.baseUrl+'crear-programacion-pla',objeto);
  }


  EditarPlanilla(objeto:any):Observable<any>{
    return this.http.put(this.baseUrl+'editar-programacion-pla',objeto);
  }




  obtenerTiposPlanilla(cia:any,rol:any):Observable<any>{
    return this.http.get('http://138.128.245.244:8445/infosweb/api/v1/rrhh/planilla/tipos-pla-by-rol/'+cia+'/'+rol);
  }



obtenerPlanillas(mes:any,anio:any):Observable<any>{
    return this.http.get('http://138.128.245.244:8445/infosweb/api/v1/rrhh/planilla/programacion-by-anio-mes/3/'+anio+'/'+mes);
  }



  obtenerResumen(mes:any,anio:any,tipo:any,num:any,tipoDeduccion:any):Observable<any>{
    return this.http.get(this.baseUrl+'find-resumen-by-programacion-pla-suma-resta/'+'3/'+anio+'/'+mes+'/'+tipo+'/'+num+'/'+tipoDeduccion);
  }


  obtenerAccionEnc(cia:any,anio:any,mes:any,tipo:any,num:any):Observable<any>{
    return this.http.get(this.baseUrl+'find-acciones-enc-by-programacion-pla/'+cia+'/'+anio+'/'+mes+'/'+tipo+'/'+num+'/');
  }




  obtenerAccionDetalle(cia:any,anio:any,mes:any,tipo:any,num:any,tipoAccion:any):Observable<any>{
    return this.http.get(this.baseUrl+'find-acciones-det-by-programacion-pla/'+cia+'/'+anio+'/'+mes+'/'+tipo+'/'+num+'/'+tipoAccion);
  }

  public get objetoPlanillaServicio() {
    return this.objetoPlanillaService;
  }

  public set objetoPlanillaServicio(val) {
    this.objetoPlanillaService = val;
  }



}
