import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PlanillaService } from '../servicio/planilla.service';
import { EditarPlanillaComponent } from './editar-planilla/editar-planilla.component';

@Component({
    selector: 'app-planilla',
    templateUrl: './planilla.component.html',
    styleUrls: ['./planilla.component.css']
})
export class PlanillaComponent implements OnInit {
    anioConsulta:number;
    mesConsulta:number;
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

        this.anioConsulta=deadline.getFullYear();
        this.mesConsulta=deadline.getMonth() + 1;
    }

    ngOnInit(): void {}

    verDetalle(data: any) {
        /*console.log('data:'+JSON.stringify(data));
  this.servicio.obtenerResumen(data.mes,data.anio,data.tiposPlanilla.tiposPlanillaPK.codTipopla,data.numPlanilla).subscribe(
    resume=>{
      this.listaResumen=resume;
    }
  );*/

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

                //console.log('TOTALES :'+JSON.stringify(totalesPlanilla));
            });
        //console.log('valor del objeto planilla service:'+JSON.stringify(this.servicio.objetoPlanillaServicio));
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
    }

    irEditar() {
        this.flagEditar = !this.flagEditar;
        this.programacionPla = this.servicio.objetoPlanillaServicio;
    }


    filtroPantalla(){
        this.listadoPlanilla=[];
        this.servicio.obtenerPlanillas(this.mesConsulta, this.anioConsulta).subscribe((dat) => {
            // console.log(JSON.stringify(dat));
            this.listadoPlanilla = dat;
        });
    }
}
