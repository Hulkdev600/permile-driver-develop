import { Component, OnInit,Output, EventEmitter, Input,ViewChild,TemplateRef, ElementRef } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { PlatformLocation } from '@angular/common'

import { DomSanitizer} from '@angular/platform-browser';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';


@Component({
  selector: 'page-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})

export class ConfirmComponent implements OnInit {
  page : string ='confirm';
  modalRef: NgbModalRef | undefined;
  @Input() payload:any
  @Output("renewal") renewal:EventEmitter<any> = new EventEmitter();
  @Output("moveBack") moveBack:EventEmitter<any> = new EventEmitter();
  /** 모달 View **/
  @ViewChild('kakaoPaymentAppModal') kakaoPaymentAppModal: TemplateRef<any> | undefined
  @ViewChild('contractSuccessModal') contractSuccessModal: TemplateRef<any> | undefined
  @ViewChild('contractFailModal') contractFailModal: TemplateRef<any> | undefined
  @ViewChild('iframe') iframe: ElementRef<any> | undefined
  
  
  @Input() queryParams : any | undefined
  faCircleCheck = faCircleCheck;
  faCircleExclamation = faCircleExclamation

  getProductEndpoint : string ='product'
  productName:string ='';
  productType:string ='';
  insuranceCompanyName :string ='';
  validStartDay:string=''
  policyEndDay:string=''
  guaranteeSettle:string='';
  guaranteePenalty:string='';
  guaranteeLawyer:string=''


  contractURLEndpoint ='contract'
  appSchemeURL:string = ''

  closeResult = '';
  payAppOnOff = false;
  contractMessage =''
  visibilityOn=false;
  sub!: Subscription;
  // queryParams:any = {
  //   enc: '',
  //   mode : null
  // };
  constructor(
    private _httpService : HttpService,
    private activatedRoute : ActivatedRoute,
    private modalService: NgbModal,
    
    private router:Router
  ) { }

  ngOnInit(): void {
    
    // console.log(this.payload)  
    
    if(!this.payload){
      //새로고침 시 첫번째 페이지로 라우팅시킨다
      this.router.navigate(['/join/insurance-information'],{queryParams : this.queryParams})

    } else{

      this.logUser()
      this.getProduct()

    }
  }

  ngOnDestroy():void{
    this.sub?.unsubscribe()
    // console.log('ngOnDestroy Confirm Component ')
  }

  private logUser(){

      let queryParam = {...this.queryParams}; // 깊은복사로 참조주소 다른 새로운 객체 생성한다.
      queryParam['onPage'] = this.page
      queryParam['userForm'] = JSON.stringify(this.payload)

      this.sub = this._httpService.sendGetRequest('user', queryParam).subscribe(
        (response:any) => {
          let body = response.body
          // this.payload = body['payload']; // 1
          // console.log(body['payload'])
      },
        (errObj) => {
          
          let errorBody = errObj.error
          console.log(errObj)
          
        }
      )
  }


  getProduct(){
    this._httpService.sendPostRequest(this.getProductEndpoint, undefined).subscribe((response:any) => {
      
      this.productName = response.pdName;
      this.productType = response.pdType;
      this.policyEndDay = response.policyEndDay;
      this.insuranceCompanyName = response.iscName;
      this.validStartDay  = response.validStartDay;
      this.guaranteeLawyer = response.guaranteeLawyer;
      this.guaranteePenalty = response.guaranteePenalty
      this.guaranteeSettle = response.guaranteeSettle
    })
  }

  openKakaoPaymentApp(){
    
    if(this.queryParams['mode'] ==='demo'){
      alert('demo Version')
      return 
    }

    let leafletId = this.payload.byPassField.leafletId
       
    
    var varUA = navigator.userAgent
    
    if ( varUA.indexOf('android') > -1) {
      //안드로이드
      Object.defineProperty(window.navigator,"userAgent",{
        get : function(){return varUA+'/kakaonavi-webview KakaoNaviApp v3.49.0'}
      })
    } else if ( varUA.indexOf("iphone") > -1 || varUA.indexOf("ipad") > -1 ||varUA.indexOf("ipod") > -1 ) {
      //IOS
      Object.defineProperty(window.navigator,"userAgent",{
        get : function(){return varUA+'/kakaonavi-webview iphone_x KakaoNavi v3.49.0'}
      })
    }

    // console.log(varUA);

    /**
     * 
     * 결제창 띄우기
     * **/
    // this.appSchemeURL ="https://www.youtube.com/embed/ZNX4BnD2_9Q"
    this.appSchemeURL = `webview://payment?action=select_payment&item_id=${leafletId}&vertical_code=CAR_INS&action_type=create`
    

    this.open(this.kakaoPaymentAppModal,'my-class-kakao-payment-app-modal');
    // this.open(this.contractSuccessModal,'my-class-kakao-payment-app-modal');
    
    this.payAppOnOff = true;
    

    
    
    
  }

  /**
   * 계약요청보내기
   * 
   */
  contract(){
    
    if(this.queryParams['mode'] ==='demo'){
      alert('demo Version')
      return 
    }

    let headers = {
      'X-API-SECRET' : this.payload['X-API-SECRET']
    }

    this._httpService.sendPostRequest(this.contractURLEndpoint, this.payload, headers).subscribe((response:any)=> {
      
      // console.log(response)
      // console.log(response.body)
      // console.log(response)
      // 먼저 결제모달을 내린다.
      this.modalService.dismissAll();


      let resultCode = response.code
      let resultMessage = response.message
      let modal = resultCode === '200' ? this.contractSuccessModal : this.contractFailModal;
      let modalClass = resultCode === '200' ? 'my-class-contract-success-modal' : 'my-class-contract-fail-modal';
      this.contractMessage = resultMessage      
      
      this.open(modal, modalClass)  

    }),
    (errResponse:any)=>{
      console.log(errResponse)
      // this.open()
      alert('네트워크 문제가 발생하였습니다. 잠시 후에 다시 시도해주시기 바랍니다')
    }
  }
  
  onPaymentDialogSuccess(itemId: string){
    
    this.contract()
  }

  onPaymentDialogFail(itemId: any, errorCode: String, message: String){
    alert('T_결제수단 등록 실패 :: ' + message)    

  }

  //결제창이 닫혔을 때 호출하는 페이지
  onPaymentDialogClose(){
    // alert('닫기.')
  }


  /**
   * Modal 열기 
   * @param content 
   * @param myClass 
   */
  open(content:any,myClass?:string):void {

    let ngbModalOption:any = {ariaLabelledBy: 'modal-basic-title'}
    if(myClass){
      ngbModalOption['windowClass'] = myClass
    }

    this.modalRef = this.modalService.open(content,ngbModalOption);

    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    
    // push new state to history
    if(this.queryParams['enc']){
      let enc = this.queryParams['enc']
      history.pushState(null, '', `/join/confirm/enc?=${enc}&modal=open`);
    } else{
      history.pushState(null, '', `/join/confirm/mode=demo&modal=open`);
    }
    
  }

  private getDismissReason(reason: any): string {
      // go back in history if the modal is closed normal (ESC, backdrop click, cross click, close click)

      // 모달이 닫히는 이유가 ESC키 누르거나 백드랍화면을 클릭해서 클때 history.back해준다.    
      if (reason === ModalDismissReasons.ESC) {
          history.back();
          return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          history.back();
          return 'by clicking on a backdrop';
      } else {
          return  `with: ${reason}`;
      }
  }  
  

  visibilityControl(){
    this.visibilityOn = true
  }



}
