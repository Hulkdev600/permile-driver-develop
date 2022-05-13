import { Component, OnInit,SimpleChange,ViewChild,ViewContainerRef,HostListener, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
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

  queryParams :any = {
    enc : '',
    mode : undefined
  }
  routeSub : Subscription | undefined
 
  constructor(
    private activatedRoute : ActivatedRoute,
    private _httpService : HttpService,
    private router : Router,
    private modalService: NgbModal,
    private location:PlatformLocation
  ) { 
    
    location.onPopState((event)=>{
    
      if(this.modalService.hasOpenModals()) {
        
        this.modalService.dismissAll()
      }
      
    })
  }


  ngOnInit(): void {
    console.log('queryParam :',this.queryParams)
    console.log('Start Join Page')
    this.setQueryParam();
    this.pageManager();

  }

  ngOnDestroy():void{
    this.routeSub?.unsubscribe()
    // console.log('없어짐')
  }

  setQueryParam(){
    this.activatedRoute.queryParams.subscribe(params => {
      
      
      let encryptedData = encodeURI(params.enc).replace(/%20/gi,'+')
      let mode = params.mode
      
      this.queryParams['enc'] = encryptedData
      this.queryParams['mode'] = mode
      
    })
  }

  pageManager(){
    this.routeSub = this.activatedRoute.params.subscribe(result => {
      let page = result['page']  
      console.log('PageManage Set Page : ',page)
      console.log('Join Component Payload: ',this.payload)
      this.PAGE = page    
    })    
  }

  renewal(data : any){
    console.log(data)
    this.payload = data['payload'];  
    
    console.log('Renewal Payload : ',this.payload)

  }

  moveBack(){
    window.history.back()
  
  }

}


