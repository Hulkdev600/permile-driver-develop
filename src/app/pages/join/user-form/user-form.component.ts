import { Component, OnInit, Output, EventEmitter, Input, ViewChild ,ElementRef, SimpleChanges } from '@angular/core';
import { FormGroup,FormControl,FormBuilder, Validators, AbstractControl, FormArray, FormControlName } from '@angular/forms';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { MyValidator} from '../../../shared/myValidators'


@Component({
  selector: 'page-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  faCircleXmark = faCircleXmark
  @Input() payload:object | any
  @Output() nextStep:EventEmitter<any> = new EventEmitter();
  
  form!:FormGroup
  formDataArr:any[] = []
  formControlsList:any[] =[]
  driverSocialNumber:string =''
  onFormControl=''
  constructor(
    private formBuilder: FormBuilder,
    private element : ElementRef
    ) { }


  ngOnChanges(changes: SimpleChanges){
    // console.log(changes)
  }
  

  ngOnInit(): void {
    console.log(this.payload)
    this.initialFormContent()

    this.form = this.formBuilder.group({ }) // formBuilder 무상태 초기화
    
    this.addFormControl() // 첫 ngOninit 주기에 운전자Input만 세팅하기 위해 addFormControl 실행
    
  }



  next(){
    
    if(Object.keys(this.form.value).length === this.formDataArr.length && this.form.valid){
      
      this.nextPage()

    } else {

      this.addFormControl()

    }
    
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
        changePage : 'confirm',
        // payload : this.form.value
        payload : Object.assign(this.payload, this.form.value)
      }
      this.nextStep.emit(emitData)
    }

  }

  /**
   * 
   * Input Value Clear(삭제)
   * @param formControl 
   */
  clearFormControl(formControl:any){
    let formControlName = formControl.formControlName
    this.form.get(formControlName)?.setValue('')
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
    // console.log(event)
    let formControl = event.target.id
    this.onFormControl = formControl
  }

}

 /*
   * formDatas의 요소를 동적으로 추가한다.
   * 이전 배열을 돌면서 이전(prev) Input의 validation이 유효해야 다음 Input을 생성한다.
   * html에서 동적 생성하기 위해서 formControls 배열을 이용한다.
   * 입력사항이 아래로 내려가야하기에 unshift 메소드를 사용한다.
   * 
   * */
  // addFormControl(){
    
  //   for(let i = 0; i < this.formDataArr.length; i++){
      
  //     let prevFormControl;
  //     let prevFormControlValid:boolean | undefined = false 
  //     let currFormControl  = this.formDataArr[i]

  //     let controlName = currFormControl.formControlName;
  //     let initialValue = currFormControl.initialValue;
  //     let validators = currFormControl.validators

  //     if(i > 0){
  //       prevFormControl= this.formDataArr[i-1];
  //       console.log(this.form.get(prevFormControl.formControlName))
  //       prevFormControlValid = this.form.get(prevFormControl.formControlName)?.valid 
  //     } else {
  //       prevFormControlValid = true;
  //     }
      
      
  //     /* 추가하려는 것이 없어서 추가가능한 상태 && 이전 input이 검증 유효한상태일 때 추가 */
  //     if(!this.form.get(controlName) && prevFormControlValid){
        
        

  //       this.form.addControl(controlName ,new FormControl(initialValue, validators))
  //       console.log(this.form.controls)
  //       if(controlName =='driverCell'){
  //         this.cellControl(initialValue, controlName)
  //       }
  //       console.log(this.form.get(controlName))
        

  //       /* 값변경 할때마다 observable 구독하여 원하는 Handler 세팅하기 */
  //       this.form.get(controlName)?.valueChanges.subscribe(result => {
  //         // console.log(controlName,' : ', result)
  //       })

  //       /* html에 나타낼 input 배열, 화면상에 기존것이 아래로 내려가게하기위해 unshift메소드 사용 */
  //       this.formControls.unshift(currFormControl)


  //       // console.log(controlName)
  //       let input = this.element.nativeElement.querySelector('#'+controlName)
  //       console.log(input)
  //       // input.focus()
        
        
        
  //     }
      
  //     // console.log(this.element.nativeElement.querySelector('#'+controlName))
  //     // break;
  //   }
  //   console.log(this.form.value)

  // }

