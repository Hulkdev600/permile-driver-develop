import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'section-product-choice',
  templateUrl: './product-choice.component.html',
  styleUrls: ['./product-choice.component.scss']
})
export class ProductChoiceComponent implements OnInit {


  plan :String=''
  planForm! : FormGroup
  constructor(private fb : FormBuilder) { }

  ngOnInit(): void {
    this.planForm = this.fb.group({
      plan : ['',[Validators.required]]
    })
  }


  decidePlan(){

  }
}
