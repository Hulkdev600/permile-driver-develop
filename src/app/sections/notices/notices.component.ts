import { Component, OnInit,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'section-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.scss']
})
export class NoticesComponent implements OnInit {

  @Output("changePage") changePage:EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {

  }



  nextStep(){
    this.changePage.emit(3)
  }
}
