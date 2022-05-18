import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { Location, PlatformLocation, ViewportScroller } from '@angular/common';
import { Event, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { MyValidator } from 'src/app/shared/myValidators';

@Component({
  selector: 'app-insu-request',
  templateUrl: './insu-request.component.html',
  styleUrls: ['./insu-request.component.scss']
})
export class InsuRequestComponent implements OnInit {
  // @ViewChild('productSection') productSection!: HTMLElement
  // @ViewChild('termSection') termSection!: HTMLElement
  // @ViewChild('faqSection') faqSection!: HTMLElement
  // @ViewChild('contactUsSection') contactUsSection!: HTMLElement 
  @ViewChild('mainNav') mainNav!: ElementRef 

  faArrowRight = faArrowRight
  public isMenuCollapsed = true;
  active = 1;
  closeResult = '';
  modalRef: NgbModalRef | undefined;
  insuRequestForm! : FormGroup
  submitted:boolean=false;
  constructor(
    private modalService: NgbModal,
    private formBuilder : FormBuilder,
    private location:PlatformLocation,
    private router:Router,
    private _httpService : HttpService,
    private scroller: ViewportScroller,
  ) { 
    location.onPopState((event)=>{
    
      if(this.modalService.hasOpenModals()) {
        
        this.modalService.dismissAll()
      }
      
    })
  }

  ngOnInit(): void {
    console.log('tests')
    this.insuRequestForm= this.formBuilder.group({
      driverName : ['',Validators.required],
      driverCell : ['',[Validators.required,MyValidator.validateCell()]],
      driverEmail : ['',[Validators.required,Validators.email]],
      accidentDetail : ['',[Validators.required]],
      agree : [false, Validators.requiredTrue],
      // agreeInfoForOther : [false, Validators.requiredTrue]
    })
  }

  ngOnDestroy(){
    console.log('ngDestroy')
    // this.router.navigate(['/insuRequest'])
  }


  scrollToElement($element:any): void {
    console.log($element);
    console.log($element.nativeElement);
    // console.log($element.srcElement)
    this.isMenuCollapsed = true
    // $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }



  open(content:any,myClass?:string) {
    // console.log(content)

    let ngbModalOption:any = {ariaLabelledBy: 'modal-basic-title'}
    if(myClass){
      ngbModalOption['windowClass'] = myClass
    }

    this.modalRef = this.modalService.open(content, ngbModalOption)
    
    
    this.modalRef.result.then((result:any) => {
      // console.log('모달 result : ',result)
      this.closeResult = `Closed with: ${result}`;
    }, (reason:any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    history.pushState(null, '', `/insuRequest?modal=open`);
  }


  private getDismissReason(reason: any): string {
    
    console.log(this.insuRequestForm.get('driverName')?.errors)
    
    if (reason === ModalDismissReasons.ESC) {
      history.back();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      history.back();
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit(){
    console.log('test')
    this.submitted = true
    if(!this.insuRequestForm.valid){
      return
    }


    let endpoint = 'insuRequest';
    let data = this.insuRequestForm.value
    console.log('폼 value : ',data)
    
    this._httpService.sendPostRequest(endpoint,data).subscribe((response:any) => {
      console.log(response)
      if(response.code =='200'){
        alert(response.message)
      }else {
        alert('서버에 문제가 있습니다. 잠시 후에 다시 시도해주시기 바랍니다.')
      }
      
    })
  }

  moveScroll(id : string, event:any){
    this.isMenuCollapsed = true
    
    

    let navbar = document.querySelector('.navbar-nav')
    navbar?.childNodes.forEach((e:any) => {e.classList.remove('active')})

    if(id=='top'){
    
      window.scrollTo({top: 0, behavior: 'smooth'});

    } else {
      
      
      let activeElement = event.target.parentElement
      activeElement.classList.add('active')
  
      let offsetPosition = document.getElementById(id)!.offsetTop
  
      let navHeight = document.getElementById('mainNav')?.offsetHeight
      console.log(navHeight)

      window.scrollTo({
        top: offsetPosition - 87,
        behavior: "smooth"
      });


    }
    
    
    
  }


  onlyNumber(event:any){
    console.log(event)
    let TARGET = event.target;            // element
    let FORMCONTROL :string = TARGET.id;  // ReactiveForm formControl 이름
    let VALUE :string = TARGET.value;     // input의 VALUE
    let CHAR = event.data;                // 입력 데이터 ex_'A'

    console.log(FORMCONTROL)
    if(isNaN(CHAR)){
      let limitValue = VALUE.substring(0,VALUE.length - 1);
      this.insuRequestForm.get(FORMCONTROL)?.setValue(limitValue)
      return
    }
  }

  test(){
    console.log('tesfsss')
  }
}
