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
  
  decrpytEndPoint : string = 'decrypt'

  payload:object | undefined;


  constructor(
    private activatedRoute : ActivatedRoute,
    private _httpService : HttpService,
  ) { }

  ngOnChanges(changes:SimpleChange){
    // console.log(changes)
  }

  ngOnInit(): void {
    
    this.getUser()
    
  }

  private getUser(){

    this.setParams().subscribe(params => {
      
      let encryptedData = encodeURI(params.enc).replace(/%20/gi,'+')
      // console.log(encryptedData)
      let body = {
        enc : encryptedData
      }
      
      this._httpService.sendGetRequest(this.decrpytEndPoint, body).subscribe(
        (response:any) => {
          let body = response.body
          this.payload = body['payload']; // 1
          this.PAGE = 'insurance-information' // 2
          // this.PAGE = 'confirm' // 2
      },
        (error) => {
          alert(error)
        }
      )
    })
  }

  setParams(){
    return this.activatedRoute.queryParams
  }


  renewal(data : any){
    let changePage = data['changePage']
    this.payload = data['userData'];
    this.PAGE = changePage
  }

  moveBack(){
    if(this.PAGE =='user-form'){
      this.PAGE = 'insurance-information'
    }else if(this.PAGE == 'confirm'){
      this.PAGE = 'user-form'
    }
  }


    //원본
  // private getUser(){

  //   this.setParams().subscribe(params => {
      
  //     let encryptedData = encodeURI(params.enc).replace(/%20/gi,'+')
  //     console.log(encryptedData)
  //     let body = {
  //       enc : encryptedData
  //     }
      
  //     this._httpService.sendPostRequest(this.decrpytEndPoint, body).subscribe((response:any) => {
        
  //       this.user = response['payload']; // 1
  //       this.PAGE = 'insurance-information' // 2
  //       // this.PAGE = 'confirm' // 2
        
  //     })
  //   })
  // }
}
