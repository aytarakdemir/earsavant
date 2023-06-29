import { Injectable, WritableSignal, signal } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public loading: WritableSignal<boolean> = signal(false);
  private multipleLoadingRequestHandler: number = 0;

  constructor(private router: Router,) { 
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.showLoading();
      } else if (event instanceof NavigationEnd) {
        this.hideLoading();
      }
    });
  }


  showLoading() {
    this.multipleLoadingRequestHandler++;
    this.loading.set(true);
  }

  hideLoading() {
    this.multipleLoadingRequestHandler--;
    if (this.multipleLoadingRequestHandler === 0) {
      this.loading.set(false);
    }
  }
}
