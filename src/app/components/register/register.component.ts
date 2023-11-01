import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppDB } from 'src/app/services/db';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  hide = true;
  registerForm: FormGroup;

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, this.passwordStrength]),
      'username': new FormControl(null, [Validators.required])
    });
    if(localStorage.getItem('logged')){
      this.router.navigate(['/home']);
    }
  }

  async onSubmit(){
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    const username = this.registerForm.value.username;

    if((await this.appDB.register({email: email, password: password, username: username})) !== -1){
      this.router.navigate(['/home']);
    }
  }

  getErrorMessage() {
    if (this.registerForm.controls.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.registerForm.controls.email.hasError('email') ? 'Not a valid email' : '';
  }

  constructor(
    private router: Router,
    private appDB: AppDB,
  ){}

  getErrMessagePassword() {
    if (this.registerForm.controls.password.hasError('required')) {
      return 'You must enter a password';
    }
    return this.registerForm.controls.password.hasError('weakPassword') ? 'Your password must contain 1 digit and 1 uppercase letter' : '';
  }

  passwordStrength(control: FormControl): {[s: string]: boolean}{
    if(!/^(?=.*[A-Z])(?=.*\d).{5,}$/.test(control.value)){
      return {'weakPassword': true};
    }
    return null;
  }

}
