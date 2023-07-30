import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
  })

  constructor(protected override http: HttpClient) {
    super(http);
  }
  
  register() {
    this.post('http://localhost:3000/register', JSON.stringify({username: 'jcd', password: 'bionicman', email: 'jcd@unatco.gov'})).subscribe();
  }

  login() {
    this.post('http://localhost:3000/login', JSON.stringify({username: this.loginForm.value.username, password: this.loginForm.value.password})).subscribe((res) => {
        console.log(res);
        console.log(this.loginForm.value);
        const modal = <HTMLDialogElement>document.getElementById('loginModal');
        modal.close();
      },
      (err) => {
        console.log('Login Error', err);
      }
    );
  }
}
