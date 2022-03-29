import { Component, OnInit,Output, EventEmitter, Input } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
@Component({
  selector: 'page-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  @Input() payload:any
  @Output("changePage") changePage:EventEmitter<any> = new EventEmitter();

  getProductEndpoint : string ='product'

  productName:string ='';
  productType:string ='';
  insuranceCompanyName :string ='';
  policyEndDay:string=''

  contractURLEndpoint ='contract'

  constructor(
    private _httpService : HttpService
  ) { }

  ngOnInit(): void {
    console.log(this.payload)

    this.getProduct()
  }

  getProduct(){
    this._httpService.sendPostRequest(this.getProductEndpoint, undefined).subscribe((result:any) => {
      this.productName = result.pdName;
      this.productType = result.pdType;
      this.policyEndDay = result.policyEndDay;
      this.insuranceCompanyName = result.iscName;
    })

    // let promise = this._httpService.httpPost(this.getProductEndpoint, undefined).toPromise()
    // console.log(promise)

    // promise.then(result => {
    //   console.log(result)
    // })
  }

  contract(){
    console.log(this.payload)
    this._httpService.sendPostRequest(this.contractURLEndpoint, this.payload).subscribe((response:any)=> {
      console.log(response)
      alert(response.message);
      window.location.reload()
    })
  }
}
