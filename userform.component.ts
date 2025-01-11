import { CommonModule } from '@angular/common';
import { Component, isStandalone } from '@angular/core';
import { EmailValidator, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
 @Component ({
  selector:'app-userform',
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule],
  templateUrl: './userform.component.html',
  styleUrls: ['./userform.component.css']
})

export class userformcomponent{
  userForm:FormGroup; 
   submitted: boolean = false;
   showSSN=true
   showAadhar=true
   showPan=true

  constructor(){
    this.userForm=new FormGroup({
      firstname: new FormControl("",[Validators.required]),
      // firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2), Validators.maxLength(50)]],
      secondName:new FormControl("",[Validators.required,Validators.minLength(2),Validators.maxLength(50)]),
      email:new FormControl ('', [Validators.required, Validators.email]),
      dob:new FormControl ('', [Validators.required, this.dateValidator]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      address:new FormControl('', [Validators.required, Validators.minLength(10)]),
      country:new FormControl ('', [Validators.required]),
      panNo:new FormControl ('', [Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]$')]),
      aadhar:new FormControl ('', [Validators.pattern('^[0-9]{12}$')]),
      ssn:new FormControl ('', [Validators.pattern('^[0-9]{9}$')]),
      education:new FormControl ('', [Validators.required])
    });
    this.userForm.get('country')?.valueChanges.subscribe(country => {
      this.updateValidationForCountry(country);
        this.showSSN = country.toLowerCase() !== 'india';
        this.showAadhar=country.toLowerCase() ==='india';
        this.showPan=country.toLowerCase() ==='india';
    });
    this.userForm.get('education')?.valueChanges.subscribe(education=>{
      this.updatevalidationforeducation(education);
    })
  }

  ngOnInit(): void {}
 updatevalidationforeducation(education:string){
  
    const dobControl = this.userForm.get('dob');
    const educationControl = this.userForm.get('education');

    if (dobControl && dobControl.value) {
      const birthDate = new Date(dobControl.value);
      const age = this.calculateAge(birthDate);

    if (age > 18) {
      educationControl?.setValidators([Validators.required]);
    }
    else{
      educationControl?.clearValidators();
      educationControl?.setValue(''); 
    }
    educationControl?.updateValueAndValidity();
 }
}
calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

  // Update validation based on country selection
   updateValidationForCountry(country: string) {
    const panControl = this.userForm.get('panNo');
    const aadharControl = this.userForm.get('aadhar');
    const ssnControl = this.userForm.get('ssn');

    if (country.toLowerCase() === 'india') {
      // Show PAN and Aadhar, hide SSN
      this.showAadhar = true;
      this.showPan = true;
      this.showSSN = false;

      ssnControl?.disable();
      ssnControl?.setValue('');
      ssnControl?.clearValidators();

      panControl?.enable();
      panControl?.setValidators([Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]$')]);

      aadharControl?.enable();
      aadharControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{12}$')]);
    } else {
      // Show SSN, hide PAN and Aadhar
      this.showAadhar = false;
      this.showPan = false;
      this.showSSN = true;

      aadharControl?.disable();
      aadharControl?.setValue('');
      aadharControl?.clearValidators();

      panControl?.disable();
      panControl?.setValue('');
      panControl?.clearValidators();

      ssnControl?.enable();
      ssnControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{9}$')]);
    }

    // Update the validation status
    panControl?.updateValueAndValidity();
    aadharControl?.updateValueAndValidity();
    ssnControl?.updateValueAndValidity();
  }

  // Custom validator for date of birth
  dateValidator(control: any) {
    if (control.value) {
      const date = new Date(control.value);
      const today = new Date();
      if (date > today) {
        return { futureDate: true };
      }
    }
    return null;
  }

  // Getter for easy access to form fields in template
  get f() {
    return this.userForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.userForm.invalid) {
      // Mark all fields as touched to trigger validation display
      Object.keys(this.userForm.controls).forEach((key) => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    console.log('Form submitted:', this.userForm.value);
    // Add your API call or form submission logic here
  }

  // Helper method to check if field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched || this.submitted) : false;
  }

  // Helper method to get error message
  getErrorMessage(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (control && control.errors) {
      if (control.errors['required']) {
        if (fieldName === 'panNo') return 'PAN number is required for Indian residents';
        if (fieldName === 'aadhar') return 'Aadhar number is required for Indian residents';
        return 'This field is required';
      }
      if (control.errors['email']) return 'Invalid email format';
      if (control.errors['pattern']) {
        switch (fieldName) {
          case 'phone':
            return 'Phone number must be 10 digits';
          case 'panNo':
            return 'Invalid PAN number format (e.g., ABCDE1234F)';
          case 'aadhar':
            return 'Aadhar number must be 12 digits';
          case 'ssn':
            return 'SSN must be 9 digits';
          default:
            return 'Invalid format';
        }
      }
      if (control.errors['minlength']) return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
      if (control.errors['maxlength']) return `Maximum length is ${control.errors['maxlength'].requiredLength} characters`;
      if (control.errors['futureDate']) return 'Date cannot be in the future';
    }
    return '';
  }
}
