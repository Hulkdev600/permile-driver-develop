import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class HttpService {


  URLMode = 'TEST';
  rUrl = 'http://13.209.97.118';

  testUrl = this.rUrl+':3001'
  prodUrl = this.rUrl+':3000'
  constructor(private http:HttpClient,) { }


  
  getRouter(endpoint : string){

    let sendURL;
    if(this.URLMode === 'TEST'){
       sendURL = this.testUrl
    } else {
      sendURL = this.prodUrl
    }

    return sendURL+'/api/join/'+endpoint

  }


  httpPost(endpoint :any, data:any, header?:any){
    return this.http.post(this.getRouter(endpoint), data)
  }

}