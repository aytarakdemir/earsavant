import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingService } from '../../services/loading/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-bottom-menu',
  templateUrl: './bottom-menu.component.html',
  styleUrls: ['./bottom-menu.component.scss'],
  imports: [RouterModule, CommonModule]
})
export class BottomMenuComponent {
  constructor(public loadingSrv: LoadingService) {

  }

}
