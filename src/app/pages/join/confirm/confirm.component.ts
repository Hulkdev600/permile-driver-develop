import { Component, OnInit,Output, EventEmitter, Input } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
@Component({
  selector: 'page-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  @Input() user:any
  @Output("changePage") changePage:EventEmitter<any> = new EventEmitter();

  getProductEndpoint : string ='product'

  productName:string ='';
  productType:string ='';
  insuranceCompanyName :string ='';
  policyEndDay:string=''

  constructor(
    private _httpService : HttpService
  ) { }

  ngOnInit(): void {
    this.getProduct()
  }

  getProduct(){
    this._httpService.httpPost(this.getProductEndpoint, undefined).subscribe((result:any) => {
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
}
