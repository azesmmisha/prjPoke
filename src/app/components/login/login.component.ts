import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { AccountService } from 'src/app/services/account.service';
import { AppDB } from 'src/app/services/db';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private appDB: AppDB,
  ){}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, this.passwordStrength])
    });
    if(localStorage.getItem('logged')){
      this.router.navigate(['/home']);
    }
  }

  async onSubmit(){
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    if((await this.appDB.login({email: email, password: password})) !== -1){
      this.router.navigate(['/home']);
    }
  }

  getErrorMessage() {
    if (this.loginForm.controls.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.loginForm.controls.email.hasError('email') ? 'Not a valid email' : '';
  }

  getErrMessagePassword() {
    if (this.loginForm.controls.password.hasError('required')) {
      return 'You must enter a password';
    }
    return this.loginForm.controls.password.hasError('weakPassword') ? 'Your password must contain 1 digit and 1 uppercase letter' : '';
  }

  passwordStrength(control: FormControl): {[s: string]: boolean}{
    if(!/^(?=.*[A-Z])(?=.*\d).{5,}$/.test(control.value)){
      return {'weakPassword': true};
    }
    return null;
  }
}
