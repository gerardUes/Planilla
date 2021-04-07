import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-planilla',
  templateUrl: './form-planilla.component.html',
  styleUrls: ['./form-planilla.component.css']
})
export class FormPlanillaComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

}
