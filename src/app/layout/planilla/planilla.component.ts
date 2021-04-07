import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PlanillaService } from '../servicio/planilla.service';

@Component({
  selector: 'app-planilla',
  templateUrl: './planilla.component.html',
  styleUrls: ['./planilla.component.css']
})
export class PlanillaComponent implements OnInit {
  listadoPlanilla:Array<any>;
  listaResumen:Array<any>;
  closeResult: string;

  constructor(private servicio:PlanillaService,private modalService: NgbModal,private router:Router) {

    let deadline:Date = new Date();
    console.log(deadline);
    console.log(deadline.getDate());
    console.log(deadline.getFullYear());
    console.log(deadline.getMonth());


    this.servicio.obtenerPlanillas(deadline.getMonth(),deadline.getFullYear())
    .subscribe(dat=>{
      console.log(JSON.stringify(dat));
      this.listadoPlanilla=dat;
    })

  }

  ngOnInit(): void {
  }

  verDetalle(data:any){
  this.servicio.obtenerResumen(data.mes,data.anio,data.tiposPlanilla.tiposPlanillaPK.codTipopla,data.numPlanilla).subscribe(
    resume=>{
      this.listaResumen=resume;
    }
  );
  }

  open(content) {
    this.modalService.open(content,{size: 'lg', windowClass: 'modal-xl'}).result.then(
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


irFormularioPlanilla(){
    this.router.navigate(['/formPlanilla']);
}



}
