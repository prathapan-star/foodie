import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
// import { AdminComponent } from '../admin/admin.component';
import { Observable,throwError } from 'rxjs';
import { retry,catchError } from 'rxjs';
import { Admin } from './admin';
import { BehaviorSubject } from 'rxjs';
// import { Admin } from './admin';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
 
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  // addRest(value: any) {
  //  return  new Error('Method not implemented.');
  // }
  apiUrl='http://localhost:3000'
  
  constructor(private http:HttpClient) { }
  httpOptions = {
    headers:new HttpHeaders({
      'content-Type':'application/json',
    }),
  };

  getRests():Observable<Admin> {
    return this.http.get<Admin>(this.apiUrl + '/admins')
      .pipe(retry(1),catchError(this.handleError));
  }

  // HttpClient API get() method => Fetch Employee
  getRest(id:any):Observable<Admin>  {
    console.log(id);
    return this.http.get<Admin>(this.apiUrl + '/admins/' +id)
      .pipe(retry(1),catchError(this.handleError));
  }

  createRest(a:any) : Observable<Admin> {
    return this.http.post<Admin>(
      this.apiUrl+'/admins',JSON.stringify(a),this.httpOptions
    ).pipe(retry(1),catchError(this.handleError));
  }

  updateRest(id:any,a:any):Observable<Admin>{
    return this.http.put<Admin>(
      this.apiUrl+'/admins/'+id,JSON.stringify(a),this.httpOptions
    )
    .pipe(retry(1),catchError(this.handleError));
  }

  deleteRest(id:any)  {
    return this.http.delete<Admin>(this.apiUrl+'/admins/' + id,this.httpOptions)
    .pipe(retry(1),catchError(this.handleError));
  }

  handleError(error:any)  {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage=error.error.message;
    } else {
      errorMessage = `Error Code : ${error.status}\nMessage:${error.message}`
    }
    window.alert(errorMessage);
    return throwError(()=>{
      return errorMessage;
    })
  }
 


  
  cartItems$ = this.cartItemsSubject.asObservable();
  private totalAmountSubject = new BehaviorSubject<number>(0);
  totalAmount$ = this.totalAmountSubject.asObservable();

  addToCart(item: any): void {
    const currentCartItems = this.cartItemsSubject.value;
    const updatedCartItems = [...currentCartItems, item];
    this.cartItemsSubject.next(updatedCartItems);

    // Calculate total amount
    const totalAmount = updatedCartItems.reduce((total, cartItem) => total + cartItem.price, 0);
    this.totalAmountSubject.next(totalAmount);
  }

}
