import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class HttpService {


  URLMode = 'TEST';
  testUrl = 'https://toggle-driver-insu-dev.simgbiz.net';
  prodUrl = 'https://toggle-driver-insu.simgbiz.net';
  localUrl = 'http://localhost:3001'
  
  constructor(private http:HttpClient,) { }


  
  getRouter(endpoint : string){

    let sendURL;
    if(this.URLMode === 'TEST'){
       sendURL = this.testUrl
    } else if(this.URLMode === 'PROD'){
      sendURL = this.prodUrl
    } else if(this.URLMode === 'LOCAL'){
      sendURL = this.localUrl
    }

    return sendURL+'/api/join/'+endpoint

  }


  sendPostRequest(endpoint :any, data:any, _header?:any){
    return this.http.post(this.getRouter(endpoint), data, _header)
  }


  sendGetRequest(endpoint:any, queryParams?:object | any, header?:any){

    // console.log(header)
    // let apiKey =''
    // if(header){
    //   apiKey = header['X-API-SECRET']
    // }
    

    const httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json');

    
    console.log(this.getRouter(endpoint))
    return this.http.get<any>(this.getRouter(endpoint),{headers : httpHeaders, params : queryParams, observe: 'response'})  
      
  }

}
