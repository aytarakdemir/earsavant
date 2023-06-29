import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  standalone: true,
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  imports: [CommonModule]
})
export class LoadingComponent {
  constructor(private router: Router, public loadingSrv: LoadingService) {}

  ngOnInit(): void {
    
  }
  


}
