import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Base URL of the API server.
  private baseUrl:string = "https://localhost:7039/api/"
  private actualUrl:string = "";
  constructor(private http : HttpClient) { }

  // Calls API post on User control for posting User info to database.
  signUp(userObj: any) {
    this.actualUrl = this.baseUrl + "User/"
    return this.http.post<any>(`${this.actualUrl}register`, userObj);
  }

  // Calls API post on User control for posting User info to database to be checked if the user is in the database.
  login(loginObj: any) {
    this.actualUrl = this.baseUrl + "User/"
    return this.http.post<any>(`${this.actualUrl}authenticate`, loginObj);
  }

  // Calls API get on User control for posting TempUser info to database and returning its Id.
  createTempUser() {
    this.actualUrl = this.baseUrl + "User/"
    return this.http.get<any>(`${this.actualUrl}createTempUser`);
  }

  // Calls API get on User control for getting User's Id.
  getUserId(username: string){
    this.actualUrl = this.baseUrl + "User/"
    return this.http.get<any>(`${this.actualUrl}userId/${username}`)
  }

  // Calls API delete on User control for deleting all user info. If option == true, delete User also.
  deleteAllUsersInfo(option: Boolean) {
    this.actualUrl = this.baseUrl + "User/"
    return this.http.delete<any>(`${this.actualUrl}deleteAllInputs/${sessionStorage.getItem("userId")}/${option}`)
  }

  // Calls API put on PersonalInformation control for edting personal info in database.
  editPersonalInfo(infoObj: any) {
    this.actualUrl = this.baseUrl + "PersonalInformation/"
    return this.http.put<any>(`${this.actualUrl}edit/${sessionStorage.getItem("userId")}`, infoObj)
  }

  // Calls API post on PersonalInformation control for adding personal info in database.
  addPersonalInfo(infoObj: any) {
    this.actualUrl = this.baseUrl + "PersonalInformation/"
    return this.http.post<any>(`${this.actualUrl}submit/${sessionStorage.getItem("userId")}`, infoObj)
  }

  // Calls API get on PersonalInformation control for getting personal info from database.
  getPersonalInfo() {
    this.actualUrl = this.baseUrl + "PersonalInformation/"
    return this.http.get<any>(`${this.actualUrl}get/${sessionStorage.getItem("userId")}`)
  }

  // Calls API put on SkillsLanguagesCertifications control for edting SLC info in database.
  editSkills(skillsObj: any) {
    this.actualUrl = this.baseUrl + "SkillsLanguagesCertifications/"
    return this.http.put<any>(`${this.actualUrl}edit/${sessionStorage.getItem("userId")}`, skillsObj)
  }

  // Calls API put on SkillsLanguagesCertifications control for adding SLC info to database.
  addSkills(skillsObj: any) {
    this.actualUrl = this.baseUrl + "SkillsLanguagesCertifications/"
    return this.http.post<any>(`${this.actualUrl}submit/${sessionStorage.getItem("userId")}`, skillsObj)
  }

  // Calls API get on SkillsLanguagesCertifications control for getting SLC info from database.
  getSkills() {
    this.actualUrl = this.baseUrl + "SkillsLanguagesCertifications/"
    return this.http.get<any>(`${this.actualUrl}get/${sessionStorage.getItem("userId")}`)
  }

  // Calls API post on Jobs control for adding job info to database.
  submitJobsInfo(jobInfo: any){
    this.actualUrl = this.baseUrl + "Jobs/"
    return this.http.post<any>(`${this.actualUrl}submit/${sessionStorage.getItem("userId")}`, jobInfo)
  }

  // Calls API delete on Jobs control for deleting job info in database.
  deleteJob(id: number) {
    this.actualUrl = this.baseUrl + "Jobs/"
    return this.http.delete<any>(`${this.actualUrl}delete/${id}`)
  }

  // Calls API delete on Jobs control for deleting all job info associated to a User in database.
  deleteAllJobs() {
    this.actualUrl = this.baseUrl + "Jobs/"
    return this.http.delete<any>(`${this.actualUrl}delete/all/${sessionStorage.getItem("userId")}`)
  }

  // Calls API get on Jobs control for getting all jobs associated to the User from database.
  getListOfEnteredJobs() {
    this.actualUrl = this.baseUrl + "Jobs/"
    return this.http.get<any>(`${this.actualUrl}get/all/${sessionStorage.getItem("userId")}`)
  }

  // Calls API put on Jobs control for editing job info to database.
  editJob(jobInfo: any, jobId: number) {
    this.actualUrl = this.baseUrl + "Jobs/"
    return this.http.put<any>(`${this.actualUrl}edit/${jobId}`, jobInfo)
  }

  // Calls API post on Degree control for adding degree info to database.
  submitDegreesInfo(degreeInfo: any) {
    this.actualUrl = this.baseUrl + "Degrees/"
    return this.http.post<any>(`${this.actualUrl}submit/${sessionStorage.getItem("userId")}`, degreeInfo)
  }

  // Calls API delete on Degree control for deleting degree info in database.
  deleteDegree(id: number) {
    this.actualUrl = this.baseUrl + "Degrees/"
    return this.http.delete<any>(`${this.actualUrl}delete/${id}`)
  }

  // Calls API delete on Degree control for deleting all degree info associated to a User in database.
  deleteAllDegrees() {
    this.actualUrl = this.baseUrl + "Degrees/"
    return this.http.delete<any>(`${this.actualUrl}delete/all/${sessionStorage.getItem("userId")}`)
  }

  // Calls API get on Degree control for getting all degrees associated to the User from database.
  getListOfEnteredDegrees() {
    this.actualUrl = this.baseUrl + "Degrees/"
    return this.http.get<any>(`${this.actualUrl}get/all/${sessionStorage.getItem("userId")}`)
  }

  // Calls API put on Degree control for editing degree info to database. 
  editDegree(degreeInfo: any, degreeId: number) {
    this.actualUrl = this.baseUrl + "Degrees/"
    return this.http.put<any>(`${this.actualUrl}edit/${degreeId}`, degreeInfo)
  }

  // Calls API get on ResumeCreating control for downloading the resume.
  downloadResume(templateID: string) {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID is missing.');
    }
  
    //const payload = { templateID, previewOrDownload };
    //console.log(payload);
    return this.http.get<any>(`${this.baseUrl}ResumeCreating/submit/download/${userId}/${templateID}`);
  }
  
  // Calls API get on ResumeCreating control for returning the resume.
  getResume(fileName: string) {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID is missing.');
    }
  
    return this.http.get(`${this.baseUrl}ResumeCreating/get-resume/${userId}/${fileName}`, {
      responseType: 'blob',
    });
  }
}
