import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {

  PAGE : string = 'insurance-information'
  constructor(
    private activatedRoute : ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.setParams()
  }



  setParams(){
    this.activatedRoute.queryParams.subscribe(param=> {
      console.log(param)
    })
  }


  changePage(page : string){
    console.log(page)
    this.PAGE = (page)
  }
}
