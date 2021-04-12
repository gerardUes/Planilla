import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ProgramacionPla } from '../../formPlanilla/form-planilla/modeloPlanilla/ProgramacionPla';
import { ProgramacionPlaPK } from '../../formPlanilla/form-planilla/modeloPlanilla/ProgramacionPlaPK';
import { TiposPlanilla } from '../../formPlanilla/form-planilla/modeloPlanilla/TiposPlanilla';
import { TiposPlanillaPK } from '../../formPlanilla/form-planilla/modeloPlanilla/TiposPlanillaPK';
import { PlanillaService } from '../../servicio/planilla.service';

@Component({
    selector: 'app-editar-planilla',
    templateUrl: './editar-planilla.component.html',
    styleUrls: ['./editar-planilla.component.css']
})
export class EditarPlanillaComponent implements OnInit {


    planillaForm: FormGroup;
    listaTipoPlanilla:any;
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
    periodo = [
        { codigo: 1, valor: 'Quincena Uno' },
        { codigo: 2, valor: 'Quincena Dos' }
    ];
    fechaInicial: NgbDateStruct;
    fechaFinal: NgbDateStruct;
    fechaPago: NgbDateStruct;
    fechaInicialHX: NgbDateStruct;
    fechaFinalHX: NgbDateStruct;
    fechaInicialNoc: NgbDateStruct;
    fechaFinalNoc: NgbDateStruct;
    fechaInicialAlimento: NgbDateStruct;
    fechaFinAlimento: NgbDateStruct;
    date: { year: number; month: number };

    @Input() mostrarFormEdicion: boolean;

    constructor(private servicioPlanilla: PlanillaService,private fb: FormBuilder,private calendar: NgbCalendar, private router: Router) {



        this.servicioPlanilla.obtenerTiposPlanilla(3,2).subscribe(
            data=>{
                this.listaTipoPlanilla=data;
            }
        );

        this.planillaForm = this.fb.group({
            codTipopla: [''],
            anio: [''],
            mese:[''],
            periodo:[''],
            proyectar:[''],
            descontar:[''],
            cuota:[''],
            comentario:[''],
            anioPrestamo:[''],
            mesPrestamo:[''],
            factorCambiario:[''],
            nota:[''],

          });



    }

    ngOnInit(): void {
    }

    hola(data: any) {
        console.log('hola david:' + JSON.stringify(data));

        this.planillaForm.get('codTipopla').setValue(data.tiposPlanilla.tiposPlanillaPK.codTipopla);
        this.planillaForm.get('anio').setValue(data.anio);
        this.planillaForm.get('mese').setValue(data.mes);
        this.planillaForm.get('periodo').setValue(data.quincena);

        if(data.fechaInicial){
            this.fechaInicial = this.calendar.getToday();
        let fechaInicialString=data.fechaInicial;
        var dateParts = fechaInicialString.split("/");
        var fechaInicialObj = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        this.fechaInicial.day=Number(dateParts[0]);
        this.fechaInicial.month=Number(dateParts[1]);
        this.fechaInicial.year=Number(dateParts[2]);
        }

        if(data.fechaFinal){
            this.fechaFinal = this.calendar.getToday();
            let fechaFinalString=data.fechaFinal;
            var dateParts = fechaFinalString.split("/");
            this.fechaFinal.day=Number(dateParts[0]);
            this.fechaFinal.month=Number(dateParts[1]);
            this.fechaFinal.year=Number(dateParts[2]);

        }

        if(data.fechaPago){

            this.fechaPago = this.calendar.getToday();
            let fechaPagoString=data.fechaPago;
            var dateParts = fechaPagoString.split("/");
            this.fechaPago.day=Number(dateParts[0]);
            this.fechaPago.month=Number(dateParts[1]);
            this.fechaPago.year=Number(dateParts[2]);

        }

        if(data.fechaInicioHx){

            this.fechaInicialHX = this.calendar.getToday();
            let fechaInicialHXString=data.fechaInicioHx;
            var dateParts = fechaInicialHXString.split("/");
            this.fechaInicialHX.day=Number(dateParts[0]);
            this.fechaInicialHX.month=Number(dateParts[1]);
            this.fechaInicialHX.year=Number(dateParts[2]);

        }

        if(data.fechaFinHx){

            this.fechaFinalHX = this.calendar.getToday();
            let fechaFinalHXString=data.fechaFinHx;
            var dateParts = fechaFinalHXString.split("/");
            this.fechaFinalHX.day=Number(dateParts[0]);
            this.fechaFinalHX.month=Number(dateParts[1]);
            this.fechaFinalHX.year=Number(dateParts[2]);
        }



        this.planillaForm.get('comentario').setValue(data.comentario);
        this.planillaForm.get('proyectar').setValue(data.diasProyectar);
        this.planillaForm.get('nota').setValue(data.observacion);


        //console.log(fechaInicialObj);
    }


    guardarPlanilla() {


        let objetoPlanilla=new ProgramacionPla();
        objetoPlanilla.programacionPlaPK=new ProgramacionPlaPK();
        objetoPlanilla.programacionPlaPK.codCia=3;
        objetoPlanilla.programacionPlaPK.periodo=Number(this.planillaForm.get('anio').value);
        objetoPlanilla.programacionPlaPK.codTipopla=this.planillaForm.get('codTipopla').value;
        objetoPlanilla.quincena=Number(this.planillaForm.get('periodo').value);
        objetoPlanilla.status='G';
        objetoPlanilla.anio=Number(this.planillaForm.get('anio').value);
        objetoPlanilla.mes=Number(this.planillaForm.get('mese').value);
        const fechaConstDate=this.fechaInicial;
        objetoPlanilla.fechaInicial=fechaConstDate.day+'/'+fechaConstDate.month+'/'+fechaConstDate.year;
        const fechaFinalConstDate=this.fechaFinal;
        objetoPlanilla.fechaFinal=fechaFinalConstDate.day+'/'+fechaFinalConstDate.month+'/'+fechaFinalConstDate.year;
        const fechaInicioHXConstDate=this.fechaInicialHX;
        objetoPlanilla.fechaInicioHx=fechaInicioHXConstDate.day+'/'+fechaInicioHXConstDate.month+'/'+fechaInicioHXConstDate.year;

        const fechaFinalHXConstDate=this.fechaFinalHX;
        objetoPlanilla.fechaFinHx=fechaFinalHXConstDate.day+'/'+fechaFinalHXConstDate.month+'/'+fechaFinalHXConstDate.year;

        objetoPlanilla.observacion=this.planillaForm.get('nota').value;
        objetoPlanilla.comentario=this.planillaForm.get('comentario').value;
        objetoPlanilla.tiposPlanilla=new TiposPlanilla();
        objetoPlanilla.tiposPlanilla.tiposPlanillaPK=new TiposPlanillaPK();
        objetoPlanilla.tiposPlanilla.tiposPlanillaPK.codCia=3;
        objetoPlanilla.tiposPlanilla.tiposPlanillaPK.codTipopla=Number(this.planillaForm.get('codTipopla').value);


        //console.log(JSON.stringify(this.planillaForm.value));
        console.log('Fecha Inicial'+JSON.stringify(this.fechaInicial));

        console.log('Objeto que se manda a guardar'+JSON.stringify(objetoPlanilla));

        this.servicioPlanilla.EditarPlanilla(objetoPlanilla).subscribe(planillaSav => {
            console.log(JSON.stringify(planillaSav));
            Swal.fire({
                title: 'Registro de planilla',
                text: 'Planilla Guardada con exito',
                icon: 'success',
                allowOutsideClick: false,
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Cerrar'
            }).then((result) => {
                if (result.value) {
                    this.router.navigateByUrl('/planilla');
                }
            });
        });
    }

}
