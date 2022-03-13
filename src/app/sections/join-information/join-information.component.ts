import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'section-join-information',
  templateUrl: './join-information.component.html',
  styleUrls: ['./join-information.component.scss']
})
export class JoinInformationComponent implements OnInit {

  @Output() changePage:EventEmitter<any> = new EventEmitter();
  userForm! : FormGroup
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      driverName : ['',[Validators.required]],
      driverCell : ['',[Validators.required]],
      driverSocialNumber : ['',[Validators.required]],
      agreeCi : ['',[Validators.required]],
      naviId : ['',[Validators.required]]
    })
  }

  onSubmit(){
    console.log(this.userForm.value)
    
  }

  nextStep(){
    this.changePage.emit(4);
  }



}
