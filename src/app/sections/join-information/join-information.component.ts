import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'section-join-information',
  templateUrl: './join-information.component.html',
  styleUrls: ['./join-information.component.scss']
})
export class JoinInformationComponent implements OnInit {

  userForm! : FormGroup
  constructor() { }

  ngOnInit(): void {
  }

}
