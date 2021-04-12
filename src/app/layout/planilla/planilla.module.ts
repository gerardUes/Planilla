import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageHeaderModule } from '../../shared';
import { PlanillaRoutingModule } from './planilla-routing.module';
import { PlanillaComponent } from './planilla.component';
import { EditarPlanillaComponent } from './editar-planilla/editar-planilla.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule, IConfig } from 'ngx-mask'

@NgModule({
    imports: [  NgxMaskModule.forRoot(),CommonModule, PlanillaRoutingModule, PageHeaderModule,NgbModule,FormsModule,ReactiveFormsModule],
    declarations: [PlanillaComponent, EditarPlanillaComponent]
})
export class PlanillaModule {}
