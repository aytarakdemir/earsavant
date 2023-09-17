import { Component } from '@angular/core';
import { AuthenticationService } from './shared/services/authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'comms';

  constructor(public authenticationSrv: AuthenticationService) {

  }
}
