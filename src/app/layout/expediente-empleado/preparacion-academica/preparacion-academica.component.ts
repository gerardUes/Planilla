import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preparacion-academica',
  templateUrl: './preparacion-academica.component.html',
  styleUrls: ['./preparacion-academica.component.css']
})
export class PreparacionAcademicaComponent implements OnInit {
  listaAcademico=[{nombreInstituto:'instituto',titulo:'doctor',anioEgre:2020,anioIngre:2018,colegiado:1},
  {nombreInstituto:'academia',titulo:'musico',anioEgre:2020,anioIngre:2018,colegiado:1}
];
  constructor() { }

  


  ngOnInit(): void {
  }

}
