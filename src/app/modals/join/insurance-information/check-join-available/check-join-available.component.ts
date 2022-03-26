import { Component, OnInit,Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-check-join-available',
  templateUrl: './check-join-available.component.html',
  styleUrls: ['./check-join-available.component.scss']
})
export class CheckJoinAvailableComponent implements OnInit {
  @Input() title: string = '';
  @Input() body: string = '';
  @Output() closeMeEvent = new EventEmitter();
  @Output() confirmEvent = new EventEmitter();


  closeMe() {
    this.closeMeEvent.emit();
  }
  confirm() {
    this.confirmEvent.emit();
  } 


  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    console.log(' Modal destroyed');
  }

}
