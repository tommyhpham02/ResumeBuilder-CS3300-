import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { jwtDecode } from 'jwt-decode';

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
    return this.http.get<any>(`${this.actualUrl}userId/${username}`)
  }

  submitPersonalInfo(infoObj: any){
    this.actualUrl = this.baseUrl + "Input/"
    return this.http.put<any>(`${this.actualUrl}submit/personalInfo/${sessionStorage.getItem("userId")}`, infoObj)
  }

  submitJobsInfo(jobList: any[]){
    this.actualUrl = this.baseUrl + "Input/"
    return this.http.post<any>(`${this.actualUrl}submit/jobs/${sessionStorage.getItem("userId")}`, jobList)
  }
}
