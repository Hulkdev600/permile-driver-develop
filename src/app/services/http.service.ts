import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router } from '@angular/router';
import {Subscription} from 'rxjs/'

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  protected subscription: Subscription | undefined;

  URLMode = 'TEST';
  testUrl = 'https://toggle-driver-insu-dev.simgbiz.net';
  prodUrl = 'https://toggle-driver-insu.simgbiz.net';
  localUrl = 'http://localhost:3001'
  
  constructor(
    private http:HttpClient,
    private activatedRoute : ActivatedRoute,
    private router: Router
    ) { 
      this.router.events.subscribe((event) => {
        if(event instanceof NavigationEnd && event.url) {
          console.log(event.url);
        }
      });
    }


  
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

    console.log('endPoint :',endpoint)
    console.log('queryParam :',queryParams)
    

    const httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json');

    
    // console.log(this.getRouter(endpoint))
    return this.http.get<any>(this.getRouter(endpoint),{headers : httpHeaders, params : queryParams, observe: 'response'})  
      
  }

  logUserRequest(encryptedData:string,page:string){

    let data = {
      enc : encryptedData,
      onPage : page
    }

    console.log('Requeset Data :', data)
    return this.sendGetRequest('user', data)
     
  }

}
