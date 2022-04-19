import { Component, OnInit,Output, EventEmitter, Input,ViewChild,TemplateRef, ElementRef } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'page-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})

export class ConfirmComponent implements OnInit {

  @Input() payload:any
  @Output("changePage") changePage:EventEmitter<any> = new EventEmitter();
  /** 모달 View **/
  @ViewChild('kakaoPaymentAppModal') kakaoPaymentAppModal: TemplateRef<any> | undefined
  @ViewChild('contractSuccessModal') contractSuccessModal: TemplateRef<any> | undefined
  @ViewChild('contractFailModal') contractFailModal: TemplateRef<any> | undefined
  @ViewChild('iframe') iframe: ElementRef<any> | undefined
  
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
  ) { }

  ngOnInit(): void {
    console.log(this.payload)
    this.getUser()

    this.getProduct()
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

    /**
     * 
     * 결제창 띄우기
     * **/
    this.appSchemeURL ="https://www.youtube.com/embed/ZNX4BnD2_9Q"
    
    setTimeout(() => {
      this.open(this.kakaoPaymentAppModal,'my-class-kakao-payment-app-modal');
      // this.open(this.contractSuccessModal,'my-class-kakao-payment-app-modal');
      this.payAppOnOff = true;
    },3000)
    
    // this.appSchemeURL = `webview://payment?action=select_payment&item_id=${leafletId}id&vertical_code=CAR_INS&action_type=create`
    
  }

  contract(){
    this._httpService.sendPostRequest(this.contractURLEndpoint, this.payload).subscribe((response:any)=> {
      // alert(response.message);
      
      let contractStatus = response.status
      let contractMessage = response.body.message
      let openModal = contractStatus === 200 ? this.contractSuccessModal : this.contractFailModal;
      let openModalClass = contractStatus === 200 ? 'my-class-contract-success-modal' : 'my-class-contract-fail-modal';
      
      this.contractMessage = contractMessage      
      this.open(openModal, openModalClass)  

    })
  }
  onPaymentDialogSuccess(itemId: string){
    alert('T_결제성공 Alert_contract 메소드 실행')
    this.contract()
  }
  onPaymentDialogFail(itemId: any, errorCode: String, message: String){
    alert('T_결제수단 등록 실패 :: ' + message)    
  }
  onPaymentDialogClose(){
    alert('닫기.')
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

  closeTest(){
    this.modalService.dismissAll()
  }
}
