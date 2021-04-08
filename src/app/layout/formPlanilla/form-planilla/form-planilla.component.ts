import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PlanillaService } from '../../servicio/planilla.service';

@Component({
    selector: 'app-form-planilla',
    templateUrl: './form-planilla.component.html',
    styleUrls: ['./form-planilla.component.css']
})
export class FormPlanillaComponent implements OnInit {
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
    }

    ngOnInit(): void {}

    guardarPlanilla() {

        const objetoPlanilla = {


        };

        this.planillaService.guardarPlanilla(objetoPlanilla).subscribe((planillaSave) => {
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
