import { Component, OnInit,Output, EventEmitter, Input,ViewChild,TemplateRef, ElementRef } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { PlatformLocation } from '@angular/common'

import { DomSanitizer} from '@angular/platform-browser';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'page-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})

export class ConfirmComponent implements OnInit {
  modalRef: NgbModalRef | undefined;
  @Input() payload:any
  @Output("changePage") changePage:EventEmitter<any> = new EventEmitter();
  @Output("moveBack") moveBack:EventEmitter<any> = new EventEmitter();
  /** 모달 View **/
  @ViewChild('kakaoPaymentAppModal') kakaoPaymentAppModal: TemplateRef<any> | undefined
  @ViewChild('contractSuccessModal') contractSuccessModal: TemplateRef<any> | undefined
  @ViewChild('contractFailModal') contractFailModal: TemplateRef<any> | undefined
  @ViewChild('iframe') iframe: ElementRef<any> | undefined
  
  faCircleCheck = faCircleCheck;
  faCircleExclamation = faCircleExclamation

  getProductEndpoint : string ='product'
  productName:string ='';
  productType:string ='';
  insuranceCompanyName :string ='';
  validStartDay:string=''
  policyEndDay:string=''

  contractURLEndpoint ='contract'
  appSchemeURL:string = ''

  closeResult = '';
  payAppOnOff = false;
  contractMessage =''

  constructor(
    private _httpService : HttpService,
    private activatedRoute : ActivatedRoute,
    private modalService: NgbModal,
    private location: PlatformLocation
  ) { 
    location.onPopState((event)=>{
      console.log(this.modalRef)
      if(this.modalRef !== undefined) {
        this.modalRef.close();
        // this.modalService.dismissAll()
        console.log('colse bmodal')
        return
      }
      if(this.modalRef == undefined){
        console.log('emit page')
        
        this.moveBack.emit();
      }
      


    })
  }

  ngOnInit(): void {
    history.pushState(null, '', 'page3');
    console.log(this.payload)
    this.getUser()

    this.getProduct()
    
  }

  ngOnDestroy() {
    this.modalService.dismissAll()
  }


  private getUser(){

    this.setParams().subscribe(params => {
      
      let encryptedData = encodeURI(params.enc).replace(/%20/gi,'+')
      
      // console.log(encryptedData)
      // console.log(this.payload)
      let body = {
        enc : encryptedData,
        onPage : 'confirm',
        userForm : JSON.stringify(this.payload)
      }
      
      this._httpService.sendGetRequest('user', body).subscribe(
        (response:any) => {
          let body = response.body
          // this.payload = body['payload']; // 1
          console.log(body['payload'])
      },
        (errObj) => {
          
          let errorBody = errObj.error
          
          alert(errorBody.message)
        }
      )
    })
  }

  setParams(){
    return this.activatedRoute.queryParams
  }

  getProduct(){
    this._httpService.sendPostRequest(this.getProductEndpoint, undefined).subscribe((response:any) => {
      this.productName = response.pdName;
      this.productType = response.pdType;
      this.policyEndDay = response.policyEndDay;
      this.insuranceCompanyName = response.iscName;
      this.validStartDay  = response.validStartDay;
    })
  }

  openKakaoPaymentApp(){
    // console.log(this.payload)
    let leafletId = this.payload.byPassField.leafletId
    // console.log('leafletid :',leafletId)
    
    
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

    console.log(varUA);


    // const modalState = {
    //   modal : true,
    //   desc : 'fake state for our modal'
    // };
    // history.pushState(modalState, '');

    // history.pushState(null, 'modalOpened');
    /**
     * 
     * 결제창 띄우기
     * **/
    // this.appSchemeURL ="https://www.youtube.com/embed/ZNX4BnD2_9Q"
    this.appSchemeURL = `webview://payment?action=select_payment&item_id=${leafletId}id&vertical_code=CAR_INS&action_type=create`
    

    this.open(this.kakaoPaymentAppModal,'my-class-kakao-payment-app-modal');
    // this.open(this.contractSuccessModal,'my-class-kakao-payment-app-modal');
    
    this.payAppOnOff = true;
    

    
    
    
  }

  /**
   * 계약요청보내기
   * 
   */
  contract(){
    
    this._httpService.sendPostRequest(this.contractURLEndpoint, this.payload).subscribe((response:any)=> {
      
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
  // open(content:any,myClass?:string):void {

  //   let ngbModalOption:any = {ariaLabelledBy: 'modal-basic-title'}
  //   if(myClass){
  //     ngbModalOption['windowClass'] = myClass
  //   }

  //   history.pushState(null, '', 'modalOpened');


  //   this.modalService.open(content, ngbModalOption).result.then((result:any) => {
  //     // console.log('모달 result : ',result)
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason:any) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  // private getDismissReason(reason: any): string {

    

  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }




  open(content:any,myClass?:string):void {

    let ngbModalOption:any = {ariaLabelledBy: 'modal-basic-title'}
    if(myClass){
      ngbModalOption['windowClass'] = myClass
    }

    history.pushState(null, '', 'modalOpened');


    this.modalRef = this.modalService.open(content,ngbModalOption);

     // push new state to history
     history.pushState(null, '', 'modalOpened');

     this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  private getDismissReason(reason: any): string {
      // go back in history if the modal is closed normal (ESC, backdrop click, cross click, close click)
      history.back();
    // history.go(1); // 이거로 하면 이상함
    
      if (reason === ModalDismissReasons.ESC) {
          return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return 'by clicking on a backdrop';
      } else {
          return  `with: ${reason}`;
      }
  }  
  

}
