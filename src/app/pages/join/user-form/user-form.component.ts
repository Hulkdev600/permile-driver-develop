import { Component, OnInit, Output, EventEmitter, Input, ViewChild, Renderer2,ElementRef } from '@angular/core';
import { FormGroup,FormControl,FormBuilder, Validators } from '@angular/forms';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { MyValidator} from '../../../shared/myValidators'


@Component({
  selector: 'page-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  myValidator = new MyValidator();
  faCircleXmark = faCircleXmark
  @Input() user:any
  @Output() nextStep:EventEmitter<any> = new EventEmitter();
  @ViewChild('input') input : ElementRef | undefined
  @ViewChild('form',{static:false}) form : ElementRef | undefined

  TESTUSER = {
    driverName : '테스터',
    driverCell : '01012345678'
  }
  userForm!:FormGroup

  formDataArr:any[] = []
  formControls:any[] =[ ]

  driverSocialNumber:string =''

  


  constructor(
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private elementRef : ElementRef
    ) { }

  ngOnInit(): void {
    // console.log(typeof this.testObject)
    // console.log(typeof this.user)
    // console.log(this.user)
    this.initialFormContent()
    
    this.userForm = this.formBuilder.group({})
    this.addFormControl()

  }

  next(){
    
    if(Object.keys(this.userForm.value).length === this.formDataArr.length && this.userForm.valid){
      
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
        initialValue : this.TESTUSER.driverName,
        event : null,
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
        event : 'input',
        handler : this.cellControl,
        validators: [
          Validators.required,
        ]
      },
      {
        formControlName : 'driverCell',
        type : 'text',
        placeholder :'휴대폰',
        maxLength : 17,
        initialValue : this.TESTUSER.driverCell,
        event : 'input',
        handler : this.socialNumberControl,
        validators: [
          Validators.required,
          this.myValidator.validateCell
        ]
      },
    ]
  }



  /*
   * formDatas의 요소를 동적으로 추가한다.
   * 이전 배열을 돌면서 이전(prev) Input의 validation이 유효해야 다음 Input을 생성한다.
   * html에서 동적 생성하기 위해서 formControls 배열을 이용한다.
   * 입력사항이 아래로 내려가야하기에 unshift 메소드를 사용한다.
   * 
   * */
  addFormControl(){
    // console.log(this.driverName)
    for(let i = 0; i < this.formDataArr.length; i++){
      
      let prevFormControl;
      let prevFormControlValid:boolean | undefined = false 
      let currFormControl  = this.formDataArr[i]

      let controlName = currFormControl.formControlName;
      let initialValue = currFormControl.initialValue;
      let validators = currFormControl.validators
      let event = currFormControl.event;
      let eventHandler = currFormControl.eventHandler
      

      if(i > 0){
        prevFormControl= this.formDataArr[i-1];
        prevFormControlValid = this.userForm.get(prevFormControl.formControlName)?.valid 
      } else {
        prevFormControlValid = true;
      }
      
      
      // 추가하려는 것이 없어서 추가가능한 상태 && 이전 input이 검증 유효한상태일 때 추가
      if(!this.userForm.get(controlName) && prevFormControlValid){

        this.userForm.addControl(controlName ,new FormControl(initialValue, validators))

        this.userForm.get(controlName)?.valueChanges.subscribe(result => {
          console.log(controlName,' : ', result)
        })

        // html에 나타낼 input 배열, 화면상에 기존것이 아래로 내려가게하기위해 unshift한다.
        this.formControls.unshift(currFormControl)

        break;
      }

    }
    

  }

  nextPage(){

    // console.log('nextPage TEST')
    // console.log(this.userForm.valid)
    if(this.userForm.valid){

      let emitData = {
        changePage : 'confirm',
        user : this.userForm.value
      }
      this.nextStep.emit(emitData)
    }

  }

  clearFormControl(formControl:any){
    let formControlName = formControl.formControlName
    this.userForm.get(formControlName)?.setValue('')
  }


  
  customizeValue(event:any):void{
    
    
    let TARGET = event.target;            // element
    let FORMCONTROL :string = TARGET.id;  // ReactiveForm formControl 이름
    let VALUE :string = TARGET.value;     // input의 VALUE
    let CHAR = event.data;                // 입력 데이터 ex_'A'
    
    // 운전자명만 입력그대로 허용
    if(FORMCONTROL === 'driverName'){ 
      this.userForm.get(FORMCONTROL)?.setValue(VALUE);
      return
    }   
  
    // 운전자휴대폰,운전자주민등록번호 입력 시 숫자가 아닌 문자값들은 입력되지 않도록 한다.
    if(isNaN(CHAR)){
      let limitValue = VALUE.substring(0,VALUE.length - 1);
      this.userForm.get(FORMCONTROL)?.setValue(limitValue)
      return
    }
    
    // 숫자 입력한다면 입력문자들은 컨트롤한다.
    switch(FORMCONTROL){
      case 'driverSocialNumber' :  this.socialNumberControl(VALUE, CHAR, TARGET, FORMCONTROL); break;
      case 'driverCell'         :  this.cellControl(CHAR, TARGET, FORMCONTROL); break; 
    }
    
    console.log(this.userForm.value)
  }


  cellControl(cell:string, el:any, formControlName:string):void{
    
    cell = cell.replace(/[^0-9]/gi,'');
    // console.log('입력 :',cell)
    // console.log('길이 : ',cell.length)
    
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

    this.userForm.get(formControlName)?.setValue(cell);
    el.value = cellChanged;

    
  }


  // 폼의 값으로는 실제값을 넣어주지만
  socialNumberControl(value:string, char:string, el:any, formControlName:string):void{    
    // console.log('주민번호Input길이 : ',value.length)
    // console.log('문자 : ',char)

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


    this.userForm.get(formControlName)?.setValue(this.driverSocialNumber);
    el.value = numberChanged;
  
  }


}
