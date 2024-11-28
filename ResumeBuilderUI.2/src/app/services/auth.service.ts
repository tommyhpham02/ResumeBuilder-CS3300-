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

  signUp(userObj: any){
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

  deleteAllUsersInfo(){
    this.actualUrl = this.baseUrl + "User/"
    return this.http.delete<any>(`${this.actualUrl}deleteAllInputs/${sessionStorage.getItem("userId")}`)
  }

  editPersonalInfo(infoObj: any){
    this.actualUrl = this.baseUrl + "PersonalInformation/"
    return this.http.put<any>(`${this.actualUrl}edit/${sessionStorage.getItem("userId")}`, infoObj)
  }

  addPersonalInfo(infoObj: any){
    this.actualUrl = this.baseUrl + "PersonalInformation/"
    return this.http.post<any>(`${this.actualUrl}submit/${sessionStorage.getItem("userId")}`, infoObj)
  }

  getPersonalInfo() {
    this.actualUrl = this.baseUrl + "PersonalInformation/"
    return this.http.get<any>(`${this.actualUrl}get/${sessionStorage.getItem("userId")}`)
  }

  editSkills(skillsObj: any){
    this.actualUrl = this.baseUrl + "SkillsLanguagesCertifications/"
    return this.http.put<any>(`${this.actualUrl}edit/${sessionStorage.getItem("userId")}`, skillsObj)
  }

  addSkills(skillsObj: any){
    this.actualUrl = this.baseUrl + "SkillsLanguagesCertifications/"
    return this.http.post<any>(`${this.actualUrl}submit/${sessionStorage.getItem("userId")}`, skillsObj)
  }

  getSkills() {
    this.actualUrl = this.baseUrl + "SkillsLanguagesCertifications/"
    return this.http.get<any>(`${this.actualUrl}get/${sessionStorage.getItem("userId")}`)
  }

  submitPersonalInfo(infoObj: any){
    this.actualUrl = this.baseUrl + "PersonalInformation/"
    return this.http.put<any>(`${this.actualUrl}edit/${sessionStorage.getItem("userId")}`, infoObj)
  }

  submitSLC(slcObj: any){
    this.actualUrl = this.baseUrl + "PersonalInformation/"
    return this.http.put<any>(`${this.actualUrl}edit/${sessionStorage.getItem("userId")}`, slcObj)
  }

  submitJobsInfo(jobInfo: any){
    this.actualUrl = this.baseUrl + "Jobs/"
    return this.http.post<any>(`${this.actualUrl}submit/${sessionStorage.getItem("userId")}`, jobInfo)
  }

  deleteJob(id: number){
    this.actualUrl = this.baseUrl + "Jobs/"
    return this.http.delete<any>(`${this.actualUrl}delete/${id}`)
  }

  deleteAllJobs() {
    this.actualUrl = this.baseUrl + "Jobs/"
    return this.http.delete<any>(`${this.actualUrl}delete/all/${sessionStorage.getItem("userId")}`)
  }

  getListOfEnteredJobs() {
    this.actualUrl = this.baseUrl + "Jobs/"
    return this.http.get<any>(`${this.actualUrl}get/all/${sessionStorage.getItem("userId")}`)
  }

  editJob(jobInfo: any, jobId: number) {
    this.actualUrl = this.baseUrl + "Jobs/"
    return this.http.put<any>(`${this.actualUrl}edit/${jobId}`, jobInfo)
  }

  submitDegreesInfo(degreeInfo: any){
    this.actualUrl = this.baseUrl + "Degrees/"
    return this.http.post<any>(`${this.actualUrl}submit/${sessionStorage.getItem("userId")}`, degreeInfo)
  }

  deleteDegree(id: number){
    this.actualUrl = this.baseUrl + "Degrees/"
    return this.http.delete<any>(`${this.actualUrl}delete/${id}`)
  }

  deleteAllDegrees() {
    this.actualUrl = this.baseUrl + "Degrees/"
    return this.http.delete<any>(`${this.actualUrl}delete/all/${sessionStorage.getItem("userId")}`)
  }

  getListOfEnteredDegrees() {
    this.actualUrl = this.baseUrl + "Degrees/"
    return this.http.get<any>(`${this.actualUrl}get/all/${sessionStorage.getItem("userId")}`)
  }

  editDegree(degreeInfo: any, degreeId: number) {
    this.actualUrl = this.baseUrl + "Degrees/"
    return this.http.put<any>(`${this.actualUrl}edit/${degreeId}`, degreeInfo)
  }

  submitDegreeInfo(degreeInfo: any){
    this.actualUrl = this.baseUrl + "Input/"
    return this.http.post<any>(`${this.actualUrl}submit/degrees/${sessionStorage.getItem("userId")}`, degreeInfo)
  }

  downloadResume(templateID: any){
    this.actualUrl = this.baseUrl + "ResumeCreating/";
    return this.http.post<any>(`${this.actualUrl}submit/download/${sessionStorage.getItem("userId")}`, '');
}


  // deleteDegree(id: number){
  //   this.actualUrl = this.baseUrl + "Input/"
  //   return this.http.delete<any>(`${this.actualUrl}delete/degree/${id}`)
  // }
}
