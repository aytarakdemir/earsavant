import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BaseService } from 'src/app/core/base/base.service';
import * as Tone from 'tone';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends BaseService {
  constructor(protected override http: HttpClient) {
    super(http);
  }
  
  a() {
    this.post('http://localhost:3000/register', JSON.stringify({username: 'jcd', password: 'bionicman', email: 'jcd@unatco.gov'})).subscribe();
  }

  b() {
    this.post('http://localhost:3000/login', JSON.stringify({username: 'jcd', password: 'bionicman'})).subscribe((res) => {
        console.log(res);
      }
    );
  }
}
