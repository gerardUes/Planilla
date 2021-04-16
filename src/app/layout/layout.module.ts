import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbDropdownModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { CustomDateParserFormatter } from './date-picker/datepicker-formatter';


@NgModule({
    imports: [CommonModule, LayoutRoutingModule, TranslateModule, NgbDropdownModule],
    declarations: [LayoutComponent, SidebarComponent, HeaderComponent],
    providers: [{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }]
})
export class LayoutModule {}
