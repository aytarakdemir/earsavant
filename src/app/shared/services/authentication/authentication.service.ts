import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, catchError, interval, map, of, repeat, retry, takeUntil } from 'rxjs';
import { BaseService } from 'src/app/core/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends BaseService implements OnDestroy {

  private authenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public authenticated$: Observable<boolean> = this.authenticated.asObservable();

  getSubscription: Subscription;

  constructor(protected override http: HttpClient) {
    super(http);


    this.getSubscription = this.get('http://localhost:3000/check_authentication')
    .pipe(
      catchError((err:any) => {
        this.authenticated.next(false);
        return of('Error')
      }),
      repeat({delay: 5000}),
    )
    .subscribe(
      { 
        next: (res: any) => {
          if (res !== 'Error')
            this.authenticated.next(true);
        },
        error: (err: any) => {
          this.authenticated.next(false);
      }}    
    );
  }

  ngOnDestroy(): void {
    this.getSubscription.unsubscribe();
  }
}
