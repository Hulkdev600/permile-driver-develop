import { Component, OnInit,SimpleChange,ViewChild,ViewContainerRef,HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CryptoService } from 'src/app/services/crypto.service';
import { HttpService } from 'src/app/services/http.service';
import { ModalService } from 'src/app/services/modal.service';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Location, PlatformLocation } from '@angular/common';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {
  
  faArrowLeft = faArrowLeft;
  PAGE : string = ''
  

  decrpytEndPoint : string = 'user'

  payload:object | undefined;

  queryString_enc:string=''
  routeSub : Subscription | undefined
 
  constructor(
    private activatedRoute : ActivatedRoute,
    private _httpService : HttpService,
    private router : Router,
    private modalService: NgbModal,
    private location:PlatformLocation
  ) { 
    
    location.onPopState((event)=>{
    
      // console.log(history.state)
      // console.log(event)

      
      if(this.modalService.hasOpenModals()) {
        
        this.modalService.dismissAll()
      }
      
    })
  }



  ngOnInit(): void {
    


    this.setParam();
    
    if(!this.payload){
      console.log(this.payload)
      console.log('payload 업다니까 ',)
      this.router.navigate(['/join/insurance-information'],{queryParams : {enc : this.queryString_enc}})
      
    }

    this.routeSub = this.activatedRoute.params.subscribe(result => {
      
      let page = result['page']  
      // console.log('page : ',page)
      this.PAGE = page
      
    })
    
  }

  ngOnDestroy():void{
    this.routeSub?.remove
    
  }


  setParam(){
    this.activatedRoute.queryParams.subscribe(params => {
      
      let encryptedData = encodeURI(params.enc).replace(/%20/gi,'+')
    
      this.queryString_enc = encryptedData

    })
  }

  renewal(data : any){
    this.payload = data['payload'];  
    
    console.log(this.payload)
  }

  moveBack(){
    // if(this.PAGE =='user-form'){
    //   this.PAGE = 'insurance-information'
    // }else if(this.PAGE == 'confirm'){
    //   this.PAGE = 'user-form'
    // }
    window.history.back()
  }

}
