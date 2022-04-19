import { Component, OnInit,SimpleChange,ViewChild,ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CryptoService } from 'src/app/services/crypto.service';
import { HttpService } from 'src/app/services/http.service';
import { ModalService } from 'src/app/services/modal.service';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

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


  constructor(
    private activatedRoute : ActivatedRoute,
    private _httpService : HttpService,
  ) { }


  ngOnInit(): void {
    
    // this.getUser()
    // this.setParams().subs
    this.activatedRoute.queryParams.subscribe(param => {
      // console.log(param)
      if(param){
        this.PAGE = 'insurance-information'
      }
    })
    
  }


  renewal(data : any){
    let changePage = data['changePage']
    this.payload = data['payload'];
    this.PAGE = changePage
  }

  moveBack(){
    if(this.PAGE =='user-form'){
      this.PAGE = 'insurance-information'
    }else if(this.PAGE == 'confirm'){
      this.PAGE = 'user-form'
    }
  }

}
