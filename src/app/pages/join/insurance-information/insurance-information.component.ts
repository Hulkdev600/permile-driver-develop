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
  
  @Input() payload!:object | undefined

  /*fontAwesome*/
  faAngleRight = faAngleRight
  faX = faX
  faCircleExclamation = faCircleExclamation
  faLeftLong = faLeftLong
  faRightLong = faRightLong
  faDownLong = faDownLong

  isAccessOk = false

  /** modal 프로퍼티 */
  closeResult = '';
  
  @ViewChild('checkFailModal') checkFailModal: TemplateRef<any> | undefined
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
          let responseStatus = response.status
          let responseBody = response.body
          

          if(responseBody.type === 'RENEWAL'){
            
            this.isAccessOk = true;

            if(responseStatus !== '200'){
              alert(responseBody.message)
            }


          } else {

            

            if(responseStatus == 200){
              this.isAccessOk = true;
            }
  
  
            let payload = responseBody['payload']; // 1
  
            
            // 가입 중 이탈 확인하였을 때 처리
            if(responseBody.findHistory){
              let changePage = confirm('작성 중이신 가입정보가 있습니다. 이동하시겠습니까?')
              
              //  이동 'Y' 일 때 이전데이터로 변환하여 페이지 이동
              if(changePage){
                payload.driverName = payload.past.driverName;
                payload.driverCell = payload.past.driverCell;
                payload.driverSocialNumber = payload.past.driverSocialNumber;
  
                this.payload = payload;
  
                let emitData = {
                  changePage : 'confirm',
                  payload : this.payload
                }
                this.nextStep.emit(emitData)
  
                return
              }
  
            } 
  
            delete payload.past;
            this.payload = payload
            
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
