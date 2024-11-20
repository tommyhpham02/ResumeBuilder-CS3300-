import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:string = "https://localhost:7039/api/"
  private actualUrl:string = "";
  constructor(private http : HttpClient) { }

  signUp(userObj:any){
    this.actualUrl = this.baseUrl + "User/"
    return this.http.post<any>(`${this.actualUrl}register`, userObj);
  }

  login(loginObj: any){
    this.actualUrl = this.baseUrl + "User/"
    return this.http.post<any>(`${this.actualUrl}authenticate`, loginObj);
  }

  getUserId(username: string){
    this.actualUrl = this.baseUrl + "User/"
    return this.http.get<any>(`${this.actualUrl}${username}`).pipe(tap(response => {sessionStorage.setItem("userId", response)}))
  }

  submit(infoObj: any){
    this.actualUrl = this.baseUrl + "Input/"
    return this.http.put<any>(`${this.actualUrl}submit/${sessionStorage.getItem("userId")}`, infoObj)
  }
}
