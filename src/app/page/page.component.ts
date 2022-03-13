import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// var CryptoJS = require("crypto-js");
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  STEP : number = 1
  constructor(
    private activatedRoute : ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {

      let aes256SecretKey ='0123456789abcdef0123456789abcdef';
      let aes256Iv = '0123456789abcdef'

      let queryParams = params;
      console.log(queryParams)

      let {enc} = queryParams;
      console.log('enc : ',enc)
      let dec = CryptoJS.AES.decrypt(enc,aes256SecretKey, {
        iv : CryptoJS.enc.Utf8.parse(aes256Iv),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      }).toString(CryptoJS.enc.Utf8);

      console.log( "dec :", dec)

      var data = {
        driverCell : '01063000205',
        driverName :'이정훈'
      }
      console.log(JSON.stringify(data))

      
      var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), aes256SecretKey,{
        iv : CryptoJS.enc.Utf8.parse(aes256Iv),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      }).toString();
      console.log(ciphertext)

    
      var diCiphertext = CryptoJS.AES.decrypt(ciphertext, aes256SecretKey,{
        iv : CryptoJS.enc.Utf8.parse(aes256Iv),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      }).toString(CryptoJS.enc.Utf8);
      console.log(diCiphertext)


    })
  }

  changePage(page : string | number){
    console.log(page)
    this.STEP = Number(page)
  }

}
