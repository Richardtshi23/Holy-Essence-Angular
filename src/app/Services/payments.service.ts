import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private http: HttpClient) { }

  pay(checkoutForm:any) {
    this.http.post(`${environment.apiUrl}/payments/initiate-payment`, {
      email: checkoutForm.email,
      amount: checkoutForm.amount,
      userId: checkoutForm.user?.id ?? 0,
      metadata: {
        items: checkoutForm.cart,
        address: checkoutForm.address,
        city: checkoutForm.city,
        postal: checkoutForm.postal,
        name: checkoutForm.name,
        phone: checkoutForm.phone,
        user: checkoutForm.user
      }
    }, { responseType: 'text' }).subscribe(url => {
      window.location.href = url; // Redirect to Paystack
    });
  }
}
