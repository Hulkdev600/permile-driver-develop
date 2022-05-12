import { Component, OnInit, Output, EventEmitter, TemplateRef,ViewChild,ViewContainerRef, Input, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { Subscription } from 'rxjs';

import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faRightLong } from '@fortawesome/free-solid-svg-icons';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { faDownLong } from '@fortawesome/free-solid-svg-icons';
import { PlatformLocation } from '@angular/common'

@Component({
  selector: 'page-insurance-information',
  templateUrl: './insurance-information.component.html',
  styleUrls: ['./insurance-information.component.scss']
})
export class InsuranceInformationComponent implements OnInit {
  modalRef: NgbModalRef | undefined;
  @Input() payload!:any | undefined
  @Input() queryString_enc:string | undefined

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

  sub!: Subscription;

  userPastData:any = undefined
  @ViewChild('checkFailModal') checkFailModal: TemplateRef<any> | undefined
  @ViewChild('alertModal') alertModal: TemplateRef<any> | undefined
  @ViewChild('changePageChoiceModal') changePageChoiceModal: TemplateRef<any> | undefined
  @Output() renewal:EventEmitter<any> = new EventEmitter();
  

  constructor(
    private modalService: NgbModal,
    private activatedRoute : ActivatedRoute,
    private _httpService : HttpService,
    private router : Router,
    private location: PlatformLocation
    ) { 
      
    }

  ngOnInit(): void {  
    this.sub = this.setParams().subscribe(params => {
      console.log('test setParam,s')
    })

    this.getUser()
  }

  ngDestroy(){
    console.log('DESTROPYD')
    this.sub.unsubscribe()
  }


  private getUser(){
    console.log('GET USER')
    let observer = this.setParams().subscribe(params => {
 


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
    }).unsubscribe()
  }

  changePage(){

    // this.modalService.dismissAll()
    // 모달 먼저 닫고 페이지 이동한다.
    this.modalRef?.close()
    this.payload['driverName'] = this.userPastData.driverName
    this.payload['driverCell'] = this.userPastData.driverCell
    this.payload['driverSocialNumber'] = this.userPastData.driverSocialNumber
    this.payload['driverSocialNumberFirst'] = this.userPastData.driverSocialNumberFirst
    this.payload['driverSocialNumberSecond'] = this.userPastData.driverSocialNumberSecond
     
    let emitData = {
      // changePage : 'confirm',
      payload : this.payload
    }
    this.renewal.emit(emitData)
    this.router.navigate(['/join/confirm'],{queryParams : {enc : this.queryString_enc}} )
  
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

    this.modalRef = this.modalService.open(content, ngbModalOption)
    
    
    this.modalRef.result.then((result:any) => {
      // console.log('모달 result : ',result)
      this.closeResult = `Closed with: ${result}`;
    }, (reason:any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    // Fake 히스토리를 하나 추가한다(브라우저 뒤로가기 버튼 클릭 시 모달만을 삭제하기 위함)
    history.pushState(null, '', `/join/insurance-information?enc=${this.queryString_enc}&modal=open`);
    
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


  checkFail(){
    this.modalService.dismissAll('')
    
    this.open(this.checkFailModal,'my-class-check-fail-modal')
  }
  
  /**
   * 
   * 고지사항 모달 확인 후 다음 페이지로 넘어갈 떄 작동하는 method
   */
  checkSuccess(){
    this.modalRef?.close();
    
    let emitData = {
      payload : this.payload
    }

    this.renewal.emit(emitData)

    // 히스토리를 변경한다.
    // 이 method가 실행될 때 this.open 모달메소드로 인해 쿼리스트링을 추가하도록 해놓은 상태이기때문에 user-form페이지에서 뒤로가기 버튼 클릭하여 다시 해당 페이지로 돌아올 때 기존 URL로 변경시키기 위함
    history.replaceState(null, '', `/join/insurance-information?enc=${this.queryString_enc}`);

    // URL변경 :: 페이지 이동한다.
    this.router.navigate(['/join/user-form'],{queryParams : {enc : this.queryString_enc}} )
  
  }

}
