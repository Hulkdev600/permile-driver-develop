import { Component, OnInit, Output, EventEmitter, TemplateRef,ViewChild,ViewContainerRef, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'page-insurance-information',
  templateUrl: './insurance-information.component.html',
  styleUrls: ['./insurance-information.component.scss']
})
export class InsuranceInformationComponent implements OnInit {
  
  @Input() user!:object | undefined

  /*fontAwesome*/
  faAngleRight = faAngleRight
  faX = faX
  faCircleExclamation = faCircleExclamation

  /** modal 프로퍼티 */
  closeResult = '';
  
  @ViewChild('checkFailModal') checkFailModal: TemplateRef<any> | undefined
  @Output() nextStep:EventEmitter<any> = new EventEmitter();
  

  constructor(
    private modalService: NgbModal,
  
    ) { }

  ngOnInit(): void {  
    console.log(this.user)
  }


  open(content:any,myClass?:string) {
    // console.log(content)
    let ngbModalOption:any = {ariaLabelledBy: 'modal-basic-title'}
    if(myClass){
      ngbModalOption['windowClass'] = myClass
    }

    this.modalService.open(content, ngbModalOption).result.then((result:any) => {
      // console.log('모달 result : ',result)
      this.closeResult = `Closed with: ${result}`;
    }, (reason:any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }



  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  checkFail(){
    this.modalService.dismissAll('')
    
    this.open(this.checkFailModal,'my-class-check-fail-modal')
  }
  
  checkSuccess(){
    this.modalService.dismissAll('')

    let emitData = {
      changePage : 'user-form',
      userData : this.user
    }
    this.nextStep.emit(emitData)
  }

}
