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

@Component({
    selector: 'app-planilla',
    templateUrl: './planilla.component.html',
    styleUrls: ['./planilla.component.css']
})
export class PlanillaComponent implements OnInit {
    
    tipoAccion:string;
    tipo:string;
    totalIngresos:number;
    totalEgresos:number;
    totalDeducciones:number;
    totalPrestaciones:number;

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

    constructor(public servicio: PlanillaService, private modalService: NgbModal, private router: Router) {
        this.verResumenPlanilla = false;
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



        this.hijo.hola(data);

        this.servicio
            .obtenerHorasXtras(
                data.programacionPlaPK.codCia,
                data.programacionPlaPK.periodo,
                data.programacionPlaPK.secuencia,
                data.programacionPlaPK.codTipopla
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
        this.verResumenPlanilla = !this.verResumenPlanilla;
        this.flagEditar = false;
    }

    asignarTotales(data: any) {
        this.objetoTotales = data;
        this.totalEgresos= this.objetoTotales.deducciones+this.objetoTotales.liqRecibir;
        this.totalIngresos=this.objetoTotales.sueldoBase+this.objetoTotales.comisiones+this.objetoTotales.prestaciones+this.objetoTotales.vhHora;
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


generarPlanilla(){

    let programacionLLave=new ProgramacionPlaPK();
    let programacionPadre=new ProgramacionPla();

    programacionLLave=this.servicio.objetoPlanillaServicio.programacionPlaPK;

    programacionPadre.programacionPlaPK=new ProgramacionPlaPK();
    programacionPadre.programacionPlaPK=programacionLLave;

    
    this.servicio.generarPlanillaSevice(programacionPadre).subscribe(
        respuesta=>{
            console.log('Respuesta Generacion:'+JSON.stringify(respuesta));
           if(respuesta){
            Swal.fire({
                title: 'Registro de planilla',
                text: 'Planilla Generada con exito',
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
    this.router.navigate(['./planilla']);
}


}
