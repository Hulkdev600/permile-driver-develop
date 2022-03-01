import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  // STEP : number = 1
  STEP : number = 1
  constructor() { }

  ngOnInit(): void {
    
  }

  changePage(page : string | number){
    console.log(page)
    this.STEP = Number(page)
  }

}
