import { Component, OnInit,ViewChild,ViewContainerRef } from '@angular/core';
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
  PAGE : string = 'insurance-information'
  
  decrpytEndPoint : string = 'decrypt'

  user:object | undefined;


  constructor(
    private activatedRoute : ActivatedRoute,
    private _httpService : HttpService,
  ) { }

  ngOnInit(): void {
    
    this.getUser()
    
  }

  

  private getUser(){

    this.setParams().subscribe(params => {
      
      let encryptedData = encodeURI(params.enc).replace(/%20/gi,'+')
      
      let body = {
        enc : encryptedData
      }
      
      this.decryptHttp(this.decrpytEndPoint, body).subscribe(response => {
        
        this.user = response;
        console.log('user : ', this.user)
      })
    })
  }


  decryptHttp(endpoint:string, data:any){    
    return this._httpService.httpPost(endpoint, data)
  }

  setParams(){
    return this.activatedRoute.queryParams
  }


  renewal(data : any){
    console.log(data)
    let currPage = data.changePage
    this.user = data.user;
    this.PAGE = (currPage)
    
  }
}
