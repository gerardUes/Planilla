import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expediente-empleado',
  templateUrl: './expediente-empleado.component.html',
  styleUrls: ['./expediente-empleado.component.css']
})
export class ExpedienteEmpleadoComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }



  
irPreparacionAcademica(){

this.router.navigate(['preparacion-academica']);
}




}
