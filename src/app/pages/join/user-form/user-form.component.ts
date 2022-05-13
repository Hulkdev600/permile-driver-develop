import { Component, OnInit, Output, EventEmitter, Input, ViewChild ,ElementRef, SimpleChanges } from '@angular/core';
import { FormGroup,FormControl,FormBuilder, Validators, AbstractControl, FormArray, FormControlName } from '@angular/forms';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { MyValidator} from '../../../shared/myValidators'
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'page-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  
  @Input() payload:object | any
  @Input() queryString_enc:string | undefined
  @Input() queryParams : any | undefined
  @Output() renewal:EventEmitter<any> = new EventEmitter();
  @ViewChild ('driverSocialNumberFirst') driverSocialNumberFirst : any;
  @ViewChild ('driverSocialNumberSecond') driverSocialNumberSecond : any;
// @Input() payload!:Observable<any> | any;

  page : string ='user-form'
  sub!: Subscription;


  faCircleXmark = faCircleXmark

  
  form!:FormGroup
  formDataArr:any[] = []
  formControlsList:any[] =[]
  driverSocialNumber:string =''
  onFormControl='driverName'
  submitted = false;

  

  constructor(
    private formBuilder: FormBuilder,
    private element : ElementRef,
    private activatedRoute : ActivatedRoute,
    private _httpService : HttpService,
    private router : Router
    ) { }  


  ngOnInit(): void {

    // console.log('Payload userForm : ',this.payload)

    if(!this.payload){
     
      // 첫페이지로 라우팅시킨다.
      this.router.navigate(['/join/insurance-information'], {queryParams : this.queryParams})
     
    }else {
      
      this.logUser()
      this.setForm()
    
    }
    
  }


  ngOnDestroy():void{
    this.sub?.unsubscribe()
    console.log('ngOnDestroy UserForm Component ')
  }


  setForm(){
    this.form = this.formBuilder.group({
      driverName : [this.payload.driverName, [Validators.required]],
      driverCell : [this.payload.driverCell,[Validators.required,MyValidator.validateCell()]],
      driverSocialNumberFirst:[this.payload.driverSocialNumberFirst ? this.payload.driverSocialNumberFirst : '', Validators.required],
      driverSocialNumberSecond:[this.payload.driverSocialNumberSecond ? this.payload.driverSocialNumberSecond : '', Validators.required]
    },
    {
      validators : [MyValidator.validSocialNumber2('driverSocialNumberFirst', 'driverSocialNumberSecond')]
    })

    // 다음 클릭 버튼 눌렀을 때 입력 폼 하나씩 생성되던 방식 사용안함 -2022-05-04 적용
      /*
      this.initialFormContent()
      this.form = this.formBuilder.group({ }) // formBuilder 무상태 초기화
      this.addFormControl() // 첫 ngOninit 주기에 운전자Input만 세팅하기 위해 addFormControl 실행
      */
  }


  private logUser(){
    
    let queryParam = {...this.queryParams}; // 깊은복사로 참조주소 다른 새로운 객체 생성한다.
    queryParam['onPage'] = this.page
    
    this.sub = this._httpService.sendGetRequest('user', queryParam).subscribe(
      (response:any) => {
        let body = response.body
        this.payload = body['payload']; // 1
    },
      (errObj) => {
        let errorBody = errObj.error
        alert(errorBody.message)
      }
    )

  }



  initialFormContent(){
    // console.log(JSON.parse(this.user))


    this.formDataArr = [
      { 
        formControlName : 'driverName',
        type : 'text',
        placeholder :'피보험자명',
        maxLength : 20,
        initialValue : this.payload.driverName,
        validators: [
          Validators.required,
  
        ]
      },
      {
        formControlName : 'driverSocialNumber',
        type : 'text',
        placeholder:'주민등록번호',
        maxLength : 16,
        initialValue : '',
        validators: [
          Validators.required,
          MyValidator.validSocialNumber()
          
        ]
      },
      {
        formControlName : 'driverCell',
        type : 'text',
        placeholder :'휴대폰',
        maxLength : 17,
        initialValue : this.payload.driverCell,
        validators: [
          Validators.required,
          MyValidator.validateCell()
        ]
      },
    ]
  }


/**
 * 현재 View의 control개수를 확인하고 이전 Control의 valid를 검사하여 유효하면 그다음 control을 밀어넣는다.
 */
  addFormControl(){
    let inputs = this.formControlsList;

    let attacthFormIndex = inputs.length; //개수 = 넣어야할 인덱스

    let attachForm = this.formDataArr[attacthFormIndex];
    let attachFormControlName = attachForm['formControlName']
    let attachInitialValue = attachForm['initialValue']
    
    
    let prevForm = null
    let prevFormControlName = null;
    let prevValid;
    if(attacthFormIndex < 1){
      prevValid = true;

    } else {
      prevForm = this.formDataArr[attacthFormIndex - 1]
      prevFormControlName = prevForm.formControlName;
      prevValid = this.form.get(prevFormControlName)?.valid

    }

    // 이전 formControl의 validation이 유효하면 다음 control 추가한다.
    if(prevValid){
      this.form.addControl(attachForm.formControlName, new FormControl(attachForm.initialValue, attachForm.validators))
      this.formControlsList.unshift(attachForm)

      this.onFormControl = attachFormControlName
      this.form.valueChanges.subscribe(d => {
        this.form.errors
        console.log(this.form.get(attachFormControlName)?.errors)
        // console.log(this.form.get(attachFormControlName)?.errors)
      })


      // console.log(this.form.get(attachFormControlName)?.errors)
    }

    // nativeElement에 접근할 떄 setTimeout으로 접근해야 Detect가 가능
    // Reactive Form의 addControl메소드가 비동기처리로 작동해서 그런 것 같다.
    setTimeout(() => {
      
      let formElement = this.element.nativeElement.querySelector('#'+attachForm.formControlName)

      if(attachFormControlName === 'driverCell') this.cellControl(attachInitialValue, formElement, attachFormControlName)

      formElement.focus();
      
    }, 0);
    

  }

 
  nextPage(){
    // console.log(this.payload)
    if(this.form.valid){

      let emitData = {
        payload : Object.assign(this.payload, this.form.value)
      }
      this.renewal.emit(emitData)
    }

    // this.router.navigate(['/join/confirm'],{queryParams : {enc : this.queryString_enc}} )
    this.router.navigate(['/join/confirm'],{queryParams : this.queryParams} )

  }

  /**
   * 
   * Input Value Clear(삭제)
   * @param formControl 
   */
  // // 반복문으로 formControl 추가했을 때
  // clearFormControl(formControl:any){
  //   let formControlName = formControl.formControlName
  //   this.form.get(formControlName)?.setValue('')
  // }

  clearFormControl(formControl:string){
  
    
    if(formControl ==='driverSocialNumber'){
      this.form.get('driverSocialNumberFirst')?.setValue('')
      this.form.get('driverSocialNumberSecond')?.setValue('')
      this.onFormControl = 'driverSocialNumberFirst'
    } else {
      this.form.get(formControl)?.setValue('')
      this.onFormControl = formControl
    }
    
  }
  
  onlyNumber(event:any){
    // console.log(event)
    let TARGET = event.target;            // element
    let FORMCONTROL :string = TARGET.id;  // ReactiveForm formControl 이름
    let VALUE :string = TARGET.value;     // input의 VALUE
    let CHAR = event.data;                // 입력 데이터 ex_'A'


    if(isNaN(CHAR)){
      let limitValue = VALUE.substring(0,VALUE.length - 1);
      this.form.get(FORMCONTROL)?.setValue(limitValue)
      return
    }
  }

  customizeValue(event:any):void{
    
    let TARGET = event.target;            // element
    let FORMCONTROL :string = TARGET.id;  // ReactiveForm formControl 이름
    let VALUE :string = TARGET.value;     // input의 VALUE
    let CHAR = event.data;                // 입력 데이터 ex_'A'
    
    this.onFormControl = FORMCONTROL // 
    

    // 운전자명만 입력그대로 허용
    if(FORMCONTROL === 'driverName'){ 
      this.form.get(FORMCONTROL)?.setValue(VALUE);
      return
    }   
  
    // 운전자휴대폰,운전자주민등록번호 입력 시 숫자가 아닌 문자값들은 입력되지 않도록 한다.
    if(isNaN(CHAR)){
      let limitValue = VALUE.substring(0,VALUE.length - 1);
      this.form.get(FORMCONTROL)?.setValue(limitValue)
      return
    }
    
    // 숫자 입력한다면 입력문자들은 컨트롤한다.
    switch(FORMCONTROL){
      case 'driverSocialNumber' :  this.socialNumberControl(VALUE, CHAR, TARGET, FORMCONTROL); break;
      case 'driverCell'         :  this.cellControl(VALUE, TARGET, FORMCONTROL); break; 
    }
    
  }


  cellControl(cell:string, el:any, formControlName:string):void{
    
    cell = cell.replace(/[^0-9]/gi,'');
    
    let cellChanged = '';
    if(cell.length < 4 ){
      cellChanged = cell;
    } else if(cell.length < 7){
      cellChanged += cell.substr(0,3);
      cellChanged += " - ";
      cellChanged += cell.substr(3)
    } else if(cell.length < 11){
      cellChanged += cell.substr(0,3);
      cellChanged += " - ";
      cellChanged += cell.substr(3,3)
      cellChanged += " - "; 
      cellChanged += cell.substr(6)
    } else {
      cellChanged += cell.substr(0,3);
      cellChanged += " - ";
      cellChanged += cell.substr(3,4)
      cellChanged += " - "; 
      cellChanged += cell.substr(7)
    }

    this.form.get(formControlName)?.setValue(cell);
    el.value = cellChanged;
    // this.form.get(formControlName)?.setValue(cellChanged);
    
  }


  /**
   * 
   * @param value // Input value
   * @param char // 입력데이터(키보드 한번 눌렀을떄의 해당 데이터)
   * @param el // View에서 해당하는 Input
   * @param formControlName 
   */
  socialNumberControl(value:string, char:string, el:any, formControlName:string):void{    
    
    let valueLength = value.replace(/[^0-9•]/gi,'').length;
    this.driverSocialNumber += char; 
    this.driverSocialNumber = this.driverSocialNumber.substr(0, valueLength);
    let numberChanged = '';

    if(this.driverSocialNumber.length< 7){
      numberChanged = this.driverSocialNumber
    } else {
      numberChanged += this.driverSocialNumber.substr(0,6);
      numberChanged += ' - ';
      numberChanged += this.driverSocialNumber.substr(6).replace(/[0-9]/gi, '•')
    }

    this.form.get(formControlName)?.setValue(this.driverSocialNumber);
    el.value = numberChanged;
  
  }


  onCursor(event:any){
    
    let formControl = event.target.id
    this.onFormControl = formControl
    
  }
 


  /**
 * next Method Old Version  
 */
    next(){
  
    if(Object.keys(this.form.controls).length === this.formDataArr.length && this.form.valid){
      
      this.nextPage()

    } else {

      this.addFormControl()

    }
    
  }

  focusDriverSocialNumberSecond(){
    let length = this.driverSocialNumberFirst.nativeElement.value.length
    if(length === 6){
      this.driverSocialNumberSecond.nativeElement.focus()
    }
  }

}

