import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormPlanillaComponent } from '../form-planilla/form-planilla.component';
import { FormPlanillaRoutingModule } from './form-planilla-routing.module';



@NgModule({
  declarations: [FormPlanillaComponent],
  imports: [
    CommonModule,FormPlanillaRoutingModule
  ]
})
export class FormModulePlanillaModule { }
