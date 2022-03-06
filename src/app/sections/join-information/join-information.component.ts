import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'section-join-information',
  templateUrl: './join-information.component.html',
  styleUrls: ['./join-information.component.scss']
})
export class JoinInformationComponent implements OnInit {

  @Output() changePage:EventEmitter<any> = new EventEmitter();
  userForm! : FormGroup
  constructor() { }

  ngOnInit(): void {
  }


  nextStep(){
    this.changePage.emit(4);
  }



}
