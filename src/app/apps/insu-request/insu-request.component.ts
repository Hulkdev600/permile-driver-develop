import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insu-request',
  templateUrl: './insu-request.component.html',
  styleUrls: ['./insu-request.component.scss']
})
export class InsuRequestComponent implements OnInit {
  public isMenuCollapsed = true;
  active = 1;
  constructor() { }

  ngOnInit(): void {
  }


  scrollToElement($element:any): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
}
