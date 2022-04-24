import { Component, OnInit, Output, EventEmitter, TemplateRef,ViewChild,ViewContainerRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faRightLong } from '@fortawesome/free-solid-svg-icons';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { faDownLong } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'page-insurance-information',
  templateUrl: './insurance-information.component.html',
  styleUrls: ['./insurance-information.component.scss']
})
export class InsuranceInformationComponent implements OnInit {
  
  @Input() payload!:any | undefined

  /*fontAwesome*/
  faAngleRight = faAngleRight
  faX = faX
  faCircleExclamation = faCircleExclamation
  faLeftLong = faLeftLong
  faRightLong = faRightLong
  faDownLong = faDownLong

  /** 접근가능여부(다음버튼 활성화)**/
  isAccessOk = false

  /** modal 프로퍼티 */
  closeResult = '';
  alertMessage='';
  userPastData:any = undefined
  @ViewChild('checkFailModal') checkFailModal: TemplateRef<any> | undefined
  @ViewChild('alertModal') alertModal: TemplateRef<any> | undefined
  @ViewChild('changePageChoiceModal') changePageChoiceModal: TemplateRef<any> | undefined
  @Output() nextStep:EventEmitter<any> = new EventEmitter();
  

  constructor(
    private modalService: NgbModal,
    private activatedRoute : ActivatedRoute,
    private _httpService : HttpService,
    ) { }

  ngOnInit(): void {  
 

    // console.log(this.payload)
    this.getUser()
  }

  private getUser(){

    this.setParams().subscribe(params => {
      
      let encryptedData = encodeURI(params.enc).replace(/%20/gi,'+')
      
      // console.log(encryptedData)
      let body = {
        enc : encryptedData,
        onPage : 'insurance-information'
      }
      
      this._httpService.sendGetRequest('user', body).subscribe(
        (response:any) => {
          console.log(response)
          let responseBody = response.body
        
          if(responseBody.type === 'RENEWAL'){
            // 갱신일 떄


            this.isAccessOk = true;

            if(responseBody.code !== '200'){
              alert(responseBody.message)
            }


          } else {
            // 신규일 떄
            

            /**
             * User의 상태확인하여 가입 진행여부 결정
             * 계약된 인원이라면 진행 X
             * 
             * **/
            if(responseBody.code === '200'){
            
              this.isAccessOk = true; // 다음버튼 활성화

            } else {

              this.alertMessage = responseBody.message
              this.open(this.alertModal,'my-class-check-fail-modal') // 
              return

            }
            
            this.payload = responseBody['payload']; // 1
  
            // 가입 중 이탈한 이력(findHistory)를 확인하였을 경우, 가입정보확인하는 페이지로 이동할 것인지 선택하는 모달을 띄운다.
            if(responseBody.findHistory){
              this.userPastData = responseBody.payload.past
              this.open(this.changePageChoiceModal,'my-class-change-page-choice-modal')
            }
                        
          }



      },
        (errObj) => {
          // console.log(errObj)
          let errorBody = errObj.error
          // console.log(errorBody)
          alert(errorBody.message)
        }
      )
    })
  }

  changePage(){

    this.modalService.dismissAll()
    this.payload['driverName'] = this.userPastData.driverName
    this.payload['driverCell'] = this.userPastData.driverCell
    this.payload['driverSocialNumber'] = this.userPastData.driverSocialNumber
     
    let emitData = {
      changePage : 'confirm',
      payload : this.payload
    }
    this.nextStep.emit(emitData)

  }

  setParams(){
    return this.activatedRoute.queryParams
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
      payload : this.payload
    }
    this.nextStep.emit(emitData)
  }

}
