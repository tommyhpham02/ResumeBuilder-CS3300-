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

  submitSkillsInfo(skillsObj: any){
    this.actualUrl = this.baseUrl + "Input/"
    return this.http.put<any>(`${this.actualUrl}submit/skillsInfo/${sessionStorage.getItem("userId")}`, skillsObj)
  }

  submitJobsInfo(jobInfo: any){
    this.actualUrl = this.baseUrl + "Input/"
    return this.http.post<any>(`${this.actualUrl}submit/jobs/${sessionStorage.getItem("userId")}`, jobInfo)
  }

  deleteJob(id: number){
    this.actualUrl = this.baseUrl + "Input/"
    return this.http.delete<any>(`${this.actualUrl}delete/jobs/${id}`)
  }
}
