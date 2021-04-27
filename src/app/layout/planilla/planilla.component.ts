import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Console } from 'console';
import { ProgramacionPla } from '../formPlanilla/form-planilla/modeloPlanilla/ProgramacionPla';
import { ProgramacionPlaPK } from '../formPlanilla/form-planilla/modeloPlanilla/ProgramacionPlaPK';
import { TiposPlanilla } from '../formPlanilla/form-planilla/modeloPlanilla/TiposPlanilla';
import { PlanillaService } from '../servicio/planilla.service';
import { EditarPlanillaComponent } from './editar-planilla/editar-planilla.component';
import Swal from 'sweetalert2';
import { TotalesResumen } from '../formPlanilla/form-planilla/modeloPlanilla/TotalesResumen';
import { ReportesService } from '../servicio/reportes.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-planilla',
    templateUrl: './planilla.component.html',
    styleUrls: ['./planilla.component.css']
})
export class PlanillaComponent implements OnInit {
    pdfDeduc:any;
    pdfCertificacion:any;
    pdfEfectivo:any;
    pdfBoleta:any;
    certificado:any;
    tipoAccion:string;
    tipo:string;
    totalIngresos:number;
    totalEgresos:number;
    totalDeducciones:number;
    totalPrestaciones:number;
    totalesResumenLst:Array<TotalesResumen>;
    listaFormatoReportes:Array<any>;


    listaDetalleHX:Array<any>=[];


    anioConsulta: number;
    mesConsulta: number;
    meses = [
        { valor: 1, mes: 'Enero' },
        { valor: 2, mes: 'Febrero' },
        { valor: 3, mes: 'Marzo' },
        { valor: 4, mes: 'Abril' },
        { valor: 5, mes: 'Mayo' },
        { valor: 6, mes: 'Junio' },
        { valor: 7, mes: 'Julio' },
        { valor: 8, mes: 'Agosto' },
        { valor: 9, mes: 'Septiembre' },
        { valor: 10, mes: 'Octubre' },
        { valor: 11, mes: 'Noviembre' },
        { valor: 12, mes: 'Diciembre' }
    ];

    listadoPlanilla: Array<any>;
    listaResumen: Array<any>;
    listaResumenDeduccion:Array<any>;
    listaDetalleResumen:Array<any>;
    listaAccionesEnc:Array<any>;
    listaDetalleAccion:Array<any>;
    closeResult: string;
    verResumenPlanilla: boolean = false;
    listaHorasExtras: Array<any>;
    public objetoTotales: any;
    flagEditar: boolean = false;
    programacionPla: any;



    @ViewChild(EditarPlanillaComponent) hijo: EditarPlanillaComponent;

    constructor(private domSanitizer: DomSanitizer,public servicio: PlanillaService, private modalService: NgbModal, private router: Router,private servicioReportes:ReportesService) {
        this.verResumenPlanilla = false;

        this.pdfCertificacion = this.domSanitizer.bypassSecurityTrustResourceUrl(
            ''
          );

          this.pdfDeduc = this.domSanitizer.bypassSecurityTrustResourceUrl(
            ''
          );

          this.pdfEfectivo=this.domSanitizer.bypassSecurityTrustResourceUrl(
            ''
          );

        let deadline: Date = new Date();
        //console.log(deadline);
        //console.log(deadline.getDate());
        //console.log(deadline.getFullYear());
        // console.log(deadline.getMonth());

        this.servicio.obtenerPlanillas(deadline.getMonth() + 1, deadline.getFullYear()).subscribe((dat) => {
            // console.log(JSON.stringify(dat));
            this.listadoPlanilla = dat;
        });

        this.anioConsulta = deadline.getFullYear();
        this.mesConsulta = deadline.getMonth() + 1;
    }

    ngOnInit(): void { }

    verDetalle(data: any) {
        console.log('data:' + JSON.stringify(data));
        this.servicio.obtenerResumen(data.mes, data.anio, data.tiposPlanilla.tiposPlanillaPK.codTipopla, data.numPlanilla,'S').subscribe(
            resume => {
                this.listaResumen = resume;
                this.totalizarPrestaciones(this.listaResumen);
            }
        );

        this.servicio.obtenerResumen(data.mes, data.anio, data.tiposPlanilla.tiposPlanillaPK.codTipopla, data.numPlanilla,'R').subscribe(
            resume => {
                this.listaResumenDeduccion = resume;
                this.totalizarDeduccion(this.listaResumenDeduccion);
            }
        );

        this.verResumenPlanilla = true;

        this.servicio.objetoPlanillaServicio = data;
        this.programacionPla = data;

        this.obtenerFormatoReportes();

        this.hijo.hola(data);

        this.servicio
            .obtenerHorasXtras(
                data.programacionPlaPK.codCia,
                data.programacionPlaPK.periodo,
                data.mes,
                data.programacionPlaPK.codTipopla,
                data.numPlanilla
            )
            .subscribe((horasExtras) => {
                this.listaHorasExtras = horasExtras;
                //console.log('Valor de horas extras:'+JSON.stringify(horasExtras));
            });

        this.servicio
            .obtenerTotalesPlanilla(
                data.programacionPlaPK.codCia,
                data.programacionPlaPK.periodo,
                data.programacionPlaPK.secuencia,
                data.programacionPlaPK.codTipopla
            )
            .subscribe((totalesPlanilla) => {
                this.asignarTotales(totalesPlanilla);

                console.log('TOTALES :'+JSON.stringify(totalesPlanilla));
            });


            this.servicio.obtenerAccionEnc(this.servicio.objetoPlanillaServicio.programacionPlaPK.codCia,
                this.servicio.objetoPlanillaServicio.programacionPlaPK.periodo,this.servicio.objetoPlanillaServicio.mes,
                this.servicio.objetoPlanillaServicio.tiposPlanilla.tiposPlanillaPK.codTipopla,this.servicio.objetoPlanillaServicio.numPlanilla)
                .subscribe(
                    accion=>{
                        this.listaAccionesEnc=accion;
                    }
                );

                this.servicio.setBanderaInicio=false;

}

    open(content) {
        this.modalService.open(content, { size: 'lg', windowClass: 'modal-xl' }).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    irFormularioPlanilla() {
        this.router.navigate(['/formPlanilla']);
    }

    resetPantalla() {
        this.servicio.setBanderaInicio=false;
        this.verResumenPlanilla = !this.verResumenPlanilla;
        this.flagEditar = false;
    }

    asignarTotales(data: any) {
        this.objetoTotales = data;
        this.totalesResumenLst=[];

       this.llenarListado(this.objetoTotales);

        this.totalEgresos= this.objetoTotales.deducciones+this.objetoTotales.liqRecibir;
        this.totalIngresos=this.objetoTotales.sueldoBase+this.objetoTotales.comisiones+this.objetoTotales.prestaciones+this.objetoTotales.vhHora;
    }

    llenarListado(objeto:any){
        let sueldoBaseResume= new TotalesResumen();
        sueldoBaseResume.tipo='I';
        sueldoBaseResume.concepto='Sueldo Bruto';
        sueldoBaseResume.ingresoCta=objeto.sueldoBase;
        this.totalesResumenLst.push(sueldoBaseResume);

        let comisionesResume= new TotalesResumen();
        comisionesResume.tipo='I';
        comisionesResume.concepto='Comisiones';
        comisionesResume.ingresoCta=objeto.comisiones;
        this.totalesResumenLst.push(comisionesResume);

        let prestacionesResume= new TotalesResumen();
        prestacionesResume.tipo='I';
        prestacionesResume.concepto='Prestaciones';
        prestacionesResume.ingresoCta=objeto.prestaciones;
        this.totalesResumenLst.push(prestacionesResume);

        let horasxtrasResume= new TotalesResumen();
        horasxtrasResume.tipo='I';
        horasxtrasResume.concepto='Horas Extras';
        horasxtrasResume.ingresoCta=objeto.vhHora;
        this.totalesResumenLst.push(horasxtrasResume);

        let deduccionResume= new TotalesResumen();
        deduccionResume.tipo='E';
        deduccionResume.concepto='Deducciones';
        deduccionResume.egresoCta=objeto.deducciones;
        this.totalesResumenLst.push(deduccionResume);

        let liquidoResume= new TotalesResumen();
        liquidoResume.tipo='E';
        liquidoResume.concepto='Liquido';
        liquidoResume.egresoCta=objeto.liqRecibir;
        this.totalesResumenLst.push(liquidoResume);

    }

    irEditar() {
        this.flagEditar = !this.flagEditar;
        this.programacionPla = this.servicio.objetoPlanillaServicio;
    }


    filtroPantalla() {
        this.listadoPlanilla = [];
        this.servicio.obtenerPlanillas(this.mesConsulta, this.anioConsulta).subscribe((dat) => {
            // console.log(JSON.stringify(dat));
            this.listadoPlanilla = dat;
        });
    }

    totalizarPrestaciones(lista:Array<any>){
        this.totalPrestaciones =0.0;
        lista.forEach(elemento=>{
            this.totalPrestaciones =this.totalPrestaciones+Number(elemento.monto);
        });

    }

    totalizarDeduccion(lista:Array<any>){
        this.totalDeducciones =0.0;
        lista.forEach(elemento=>{
            this.totalDeducciones =this.totalDeducciones+Number(elemento.monto);
        });

    }



obtenerDetalleDeducPresta(data:any){
    this.servicio.obtenerDetalleDeducPresta(this.servicio.objetoPlanillaServicio.programacionPlaPK.codCia,
        this.servicio.objetoPlanillaServicio.programacionPlaPK.periodo,
        this.servicio.objetoPlanillaServicio.programacionPlaPK.secuencia,this.servicio.objetoPlanillaServicio.tiposPlanilla.tiposPlanillaPK.codTipopla,data).
        subscribe(
            detalle=>{
                this.listaDetalleResumen=detalle;
            }
        );

}


llenarValor(valor:string){
    this.tipo=valor;
}

llenadoTipoAccion(valor:any){
this.tipoAccion=valor;
}



obtenerDetalleAccionPersonal(data:any){

this.servicio.obtenerAccionDetalle(this.servicio.objetoPlanillaServicio.programacionPlaPK.codCia,
    this.servicio.objetoPlanillaServicio.programacionPlaPK.periodo,this.servicio.objetoPlanillaServicio.mes,
    this.servicio.objetoPlanillaServicio.tiposPlanilla.tiposPlanillaPK.codTipopla,
    this.servicio.objetoPlanillaServicio.numPlanilla,data.codTipoAccion).subscribe(
        detalleAccion=>{
            this.listaDetalleAccion=detalleAccion;
            console.log('valor del detalle'+JSON.stringify(detalleAccion));
        }
    );
}



cerrarPlanilla(){
    let programacionLLave=new ProgramacionPlaPK();
    let programacionPadre=new ProgramacionPla();

    programacionLLave=this.servicio.objetoPlanillaServicio.programacionPlaPK;

    programacionPadre.programacionPlaPK=new ProgramacionPlaPK();
    programacionPadre.programacionPlaPK=programacionLLave;

    console.log('lo que mando:'+JSON.stringify(programacionPadre));

    this.servicio.cerrarPlanillaSevice(programacionPadre).subscribe(
        respuesta=>{
           if(respuesta){
            Swal.fire({
                title: 'Registro de planilla',
                text: 'Planilla Cerrada con exito',
                icon: 'success',
                allowOutsideClick: false,
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Cerrar'
              }).then(()=> {

                this.redireccionar();

              })
           }
        }
    );

}






confirmacionCerrarPlanilla(){
    Swal.fire({
        title: 'Esta seguro?',
        text: "Cerrar planilla",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Cerrar Planilla',
        cancelButtonText:'Salir'
      }).then((result) => {
        if (result.isConfirmed) {

        this.cerrarPlanilla();

        }
      })
}



confirmacionGenerarPlanilla(){
    Swal.fire({
        title: 'Esta seguro?',
        text: "Generar planilla",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Generar',
        cancelButtonText:'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {

        this.generarPlanilla();

        }
      })

}


generarPlanilla(){

    let programacionLLave=new ProgramacionPlaPK();
    let programacionPadre=new ProgramacionPla();

    programacionLLave=this.servicio.objetoPlanillaServicio.programacionPlaPK;

    programacionPadre.programacionPlaPK=new ProgramacionPlaPK();
    programacionPadre.programacionPlaPK=programacionLLave;


    this.servicio.generarPlanillaSevice(programacionPadre).subscribe(
        respuesta=>{
            console.log('Respuesta Generacion:'+JSON.stringify(respuesta));
            this.servicio.objetoPlanillaServicio =respuesta;
           if(respuesta){
            Swal.fire({
                title: 'Registro de planilla',
                text: 'Planilla Generada con exito.',
                icon: 'success',
                allowOutsideClick: false,
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Cerrar'
              }).then(()=> {

                this.redireccionar();

              })
           }
        }
    );



}



redireccionar(){

    this.verResumenPlanilla=false;
    this.filtroPantalla();
    this.verResumenPlanilla=true;
    this.flagEditar=false;
    this.verDetalle(this.servicio.objetoPlanillaServicio);

}



llenadoHorasExtrasDetalle(param:any){
//console.log('valor que viene del encabezado hx:'+JSON.stringify(param));


this.servicio.obtenerDetalleHorasExtras(param.codCia,param.anio,param.mes,
    param.tipoPlanilla,param.numPlanilla,
    param.orden).subscribe(
        dataHX=>{
            this.listaDetalleHX=dataHX;
            console.log('Detalle horas extras:'+JSON.stringify(this.listaDetalleHX));
        }
    );
}





imprimirReporte(){
this.servicioReportes.generarReportePlanilla(this.servicio.objetoPlanillaServicio.programacionPlaPK.codCia,
    this.servicio.objetoPlanillaServicio.anio,this.servicio.objetoPlanillaServicio.programacionPlaPK.secuencia,
    this.servicio.objetoPlanillaServicio.tiposPlanilla.tiposPlanillaPK.codTipopla).subscribe(
        data=>{
            console.log('Respuesta Reporte:'+JSON.stringify(data));
            this.showCertificacion(data.archivo);
        }
    );
}



showCertificacion(datos: string) {
    this.certificado = datos;
    let resultado: string = datos;

    atob(resultado);

    const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    };

    const contentType = "application/pdf";
    const b64Data = resultado;

    const blob = b64toBlob(b64Data, contentType);
    const blobUrl = URL.createObjectURL(blob);
    this.pdfCertificacion = this.domSanitizer.bypassSecurityTrustResourceUrl(
      blobUrl
    );
  }


  mostrarDeducReporte(datos: string) {
    this.certificado = datos;
    let resultado: string = datos;

    atob(resultado);

    const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    };

    const contentType = "application/pdf";
    const b64Data = resultado;

    const blob = b64toBlob(b64Data, contentType);
    const blobUrl = URL.createObjectURL(blob);
    this.pdfDeduc = this.domSanitizer.bypassSecurityTrustResourceUrl(
      blobUrl
    );
  }



  imprimirDeduccionReporte(){


    this.servicioReportes.generarReporteDeducciones(this.servicio.objetoPlanillaServicio.programacionPlaPK.codCia,
        this.servicio.objetoPlanillaServicio.anio,this.servicio.objetoPlanillaServicio.programacionPlaPK.secuencia,
        this.servicio.objetoPlanillaServicio.tiposPlanilla.tiposPlanillaPK.codTipopla).subscribe(
            data=>{
                console.log('Respuesta blobUrl:'+JSON.stringify(data));
                this.mostrarDeducReporte(data.archivo);
            }
        );

  }





  mostrarReporteEfectivo(datos: string) {
    this.certificado = datos;
    let resultado: string = datos;

    atob(resultado);

    const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    };

    const contentType = "application/pdf";
    const b64Data = resultado;

    const blob = b64toBlob(b64Data, contentType);
    const blobUrl = URL.createObjectURL(blob);
    this.pdfEfectivo = this.domSanitizer.bypassSecurityTrustResourceUrl(
      blobUrl
    );
  }



  mostrarReporteBoleta(datos: string) {
    this.certificado = datos;
    let resultado: string = datos;

    atob(resultado);

    const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    };

    const contentType = "application/pdf";
    const b64Data = resultado;

    const blob = b64toBlob(b64Data, contentType);
    const blobUrl = URL.createObjectURL(blob);
    this.pdfBoleta = this.domSanitizer.bypassSecurityTrustResourceUrl(
      blobUrl
    );
  }







  imprimirReporteEfectivo(){


    this.servicioReportes.generarReportePagoEfectivo(this.servicio.objetoPlanillaServicio.programacionPlaPK.codCia,
        this.servicio.objetoPlanillaServicio.anio,this.servicio.objetoPlanillaServicio.programacionPlaPK.secuencia,
        this.servicio.objetoPlanillaServicio.tiposPlanilla.tiposPlanillaPK.codTipopla).subscribe(
            data=>{
                //console.log('Respuesta blobUrl:'+JSON.stringify(data));
                this.mostrarReporteEfectivo(data.archivo);
            }
        );


  }

  obtenerFormatoReportes(){
    this.servicioReportes.obtenerTiposReportes(this.servicio.objetoPlanillaServicio.programacionPlaPK.codCia,'RRHH_PORTAL',4
        ).subscribe(
            data=>{
                console.log('Respuesta formatos:'+JSON.stringify(data));
                this.listaFormatoReportes=data;
            }
        );

  }



  onChangeFormato(valor:any){
      console.log('LO QUE VIENE:'+valor);

      this.servicioReportes.generarReporteBoletas(this.servicio.objetoPlanillaServicio.programacionPlaPK.codCia,
        this.servicio.objetoPlanillaServicio.anio,this.servicio.objetoPlanillaServicio.programacionPlaPK.secuencia,
        this.servicio.objetoPlanillaServicio.tiposPlanilla.tiposPlanillaPK.codTipopla,valor).subscribe(
            data=>{
                //console.log('Respuesta blobUrl:'+JSON.stringify(data));
               this.mostrarReporteBoleta(data.archivo);
            }
        );

  }




}
