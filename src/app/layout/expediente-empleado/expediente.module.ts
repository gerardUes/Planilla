import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageHeaderModule } from '../../shared';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { ExpedienteEmpleadoComponent } from './expediente-empleado.component';
import { ExpedienteRoutingModule } from './expediente-routing.module';

@NgModule({
    imports: [  NgxMaskModule.forRoot(),CommonModule, PageHeaderModule,NgbModule,FormsModule,ReactiveFormsModule,ExpedienteRoutingModule],
    declarations: [ExpedienteEmpleadoComponent]
})
export class ExpedienteModule {
    
}