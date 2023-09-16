import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base/base.service';
import * as Tone from 'tone';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends BaseService {
  public loginForm: UntypedFormGroup = new UntypedFormGroup({
    username: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
  });
  public registerForm: UntypedFormGroup = new UntypedFormGroup({
    username: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
    email: new UntypedFormControl(''),
  });

  constructor(protected override http: HttpClient, private toastr: ToastrService) {
    super(http);
  }

  register() {
    this.post(
      'http://localhost:3000/register',
      JSON.stringify({
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
        email: this.registerForm.value.email,
      })
    ).subscribe(
      (res) => {
        console.log(res);
        const modal = <HTMLDialogElement>(
          document.getElementById('registerModal')
        );
        modal.close();
      },
      (err) => {
        console.log('Register Error', err);
        this.toastr.error(err.error.message, 'Register Error');
      }
    );
  }

  login() {
    this.post(
      'http://localhost:3000/login',
      JSON.stringify({
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      })
    ).subscribe(
      (res : any) => {
        console.log(res);
        this.toastr.success(res.message);
        localStorage.setItem('userId', res.userID);
        const modal = <HTMLDialogElement>document.getElementById('loginModal');
        modal.close();
      },
      (err) => {
        console.log('Login Error', err);
        this.toastr.error(err.error.message, 'Login Error');
      }
    );
  }

  go(){
    this.post('http://localhost:3000/check_authentication', JSON.stringify({})).subscribe(
      (res: any) => {
        console.log('Success');
        console.log(res);
      },
      (err: any) => {
        console.log(err.error.message);
        this.toastr.error(err.error.message, 'User Timeout');
      }
    );
  }
}
