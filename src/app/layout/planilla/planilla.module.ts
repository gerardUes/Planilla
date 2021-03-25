import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageHeaderModule } from '../../shared';
import { PlanillaRoutingModule } from './planilla-routing.module';
import { PlanillaComponent } from './planilla.component';

@NgModule({
    imports: [CommonModule, PlanillaRoutingModule, PageHeaderModule],
    declarations: [PlanillaComponent]
})
export class PlanillaModule {}
