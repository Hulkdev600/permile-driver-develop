import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  STEP : number = 1
  constructor(
    private activatedRoute : ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      
      let queryParams = params;
      console.log(queryParams)


    

    })
  }

  changePage(page : string | number){
    console.log(page)
    this.STEP = Number(page)
  }

}
