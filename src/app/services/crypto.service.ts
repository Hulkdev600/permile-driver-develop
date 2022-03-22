import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

 
 
  constructor() { }




  tempp () {
    let aes256SecretKey ='0123456789abcdef0123456789abcdef';
      let aes256Iv = '0123456789abcdef'

      
      
      let enc = 'test'
      
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

  }
}
