
import { Injectable } from '@angular/core';
import { Tweet } from '../models/tweets/Tweet'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
 providedIn: 'root'
})
export class TweetService {

 apiURL = 'http://localhost:8080/';

 constructor(
   private http: HttpClient,
 )
 {}

 httpOptions = {
   headers: new HttpHeaders({
     'Content-Type': 'application/json',
     'Access-Control-Allow-Origin':'*',
     'Authorization':'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvbG9wZXoiLCJpYXQiOjE3NDg1NDI4OTgsImV4cCI6MTc0ODYyOTI5OH0.XCoFqG324J34GetI4MMEmIXYBzT3D6I0KDVr58zPM4U'
   })
 }


errorMessage = "";


 getTweets(): Observable<Tweet> {
   console.log("tweets: " + this.apiURL+ 'api/tweets/all');
   return this.http.get<Tweet>(this.apiURL + 'api/tweets/all', this.httpOptions)
   .pipe(
     retry(1),
     catchError(this.handleError)
   )
 }

  // Error handling
 handleError(error : any) {
   let errorMessage = '';
   if(error.error instanceof ErrorEvent) {
     // Get client-side error
     errorMessage = error.error.message;
   } else {
     // Get server-side error
     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
   }
   console.log(errorMessage);
   window.alert(errorMessage);
   return throwError(errorMessage);
}

postTweet(myTweet: String) {

    const body = {
        tweet: myTweet,
    };

    console.log(body)

    return this.http.post(
        this.apiURL + 'api/tweets/create',
        body,
        this.httpOptions
    )
    .pipe(
        catchError(this.handleError)
    );

}

}


