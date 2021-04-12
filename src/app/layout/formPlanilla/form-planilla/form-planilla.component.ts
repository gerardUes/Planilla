import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PlanillaService } from '../../servicio/planilla.service';
import { ProgramacionPla } from './modeloPlanilla/ProgramacionPla';
import { ProgramacionPlaPK } from './modeloPlanilla/ProgramacionPlaPK';
import { TiposPlanilla } from './modeloPlanilla/TiposPlanilla';
import { TiposPlanillaPK } from './modeloPlanilla/TiposPlanillaPK';




@Component({
    selector: 'app-form-planilla',
    templateUrl: './form-planilla.component.html',
    styleUrls: ['./form-planilla.component.css']
})
export class FormPlanillaComponent implements OnInit {
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
    planillaForm: FormGroup;

    date: { year: number; month: number };

    constructor(
        private planillaService: PlanillaService,
        private router: Router,
        private calendar: NgbCalendar,
        private fb: FormBuilder
    ) {
        this.fechaInicial = this.calendar.getToday();

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

          this.planillaService.obtenerTiposPlanilla(3,2).subscribe(
              data=>{
                  this.listaTipoPlanilla=data;
              }
          );
    }

    ngOnInit(): void {}

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
        objetoPlanilla.tiposPlanilla=new TiposPlanilla();
        objetoPlanilla.tiposPlanilla.tiposPlanillaPK=new TiposPlanillaPK();
        objetoPlanilla.tiposPlanilla.tiposPlanillaPK.codCia=3;
        objetoPlanilla.tiposPlanilla.tiposPlanillaPK.codTipopla=Number(this.planillaForm.get('codTipopla').value);


        //console.log(JSON.stringify(this.planillaForm.value));
        console.log('Fecha Inicial'+JSON.stringify(this.fechaInicial));

        console.log('Objeto que se manda a guardar'+JSON.stringify(objetoPlanilla));

        this.planillaService.guardarPlanilla(objetoPlanilla).subscribe(planillaSav => {
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



irPlanilla(){
    this.router.navigate(['./planilla'])
}


editarPlanilla(){

}


}
