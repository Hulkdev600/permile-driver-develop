import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faRightLong } from '@fortawesome/free-solid-svg-icons';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { faDownLong } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-insu-information',
  templateUrl: './insu-information.component.html',
  styleUrls: ['./insu-information.component.scss']
})
export class InsuInformationComponent implements OnInit {

  modalRef: NgbModalRef | undefined;
  closeResult = '';

  /*fontAwesome*/
  faAngleRight = faAngleRight
  faX = faX
  faCircleExclamation = faCircleExclamation
  faLeftLong = faLeftLong
  faRightLong = faRightLong
  faDownLong = faDownLong
  
  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }


  open(content:any,myClass?:string) {
    // console.log(content)

    let ngbModalOption:any = {ariaLabelledBy: 'modal-basic-title'}
    if(myClass){
      ngbModalOption['windowClass'] = myClass
    }

    this.modalRef = this.modalService.open(content, ngbModalOption)
    
    
    this.modalRef.result.then((result:any) => {
      // console.log('모달 result : ',result)
      this.closeResult = `Closed with: ${result}`;
    }, (reason:any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    // Fake 히스토리를 하나 추가한다(브라우저 뒤로가기 버튼 클릭 시 모달만을 삭제하기 위함)
    history.pushState(null, '', `/insurance-information?&modal=open`);
    
  }



  private getDismissReason(reason: any): string {
    
    // history.back();
    
    if (reason === ModalDismissReasons.ESC) {
      history.back();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      history.back();
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
