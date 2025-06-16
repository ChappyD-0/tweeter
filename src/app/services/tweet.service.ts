
import { Injectable } from '@angular/core';
import { Tweet } from '../models/tweets/Tweet'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { TweetDetails } from '../models/tweets/TweetDetails';
import { ReactionRequest } from '../models/tweets/ReactionRequest';

@Injectable({
 providedIn: 'root'
})
export class TweetService {

 apiURL = 'http://localhost:8080/';
 token = '';
 constructor(
   private http: HttpClient,
   private StorageService: StorageService
 )
 {
  this.token = this.StorageService.getSession("token");
  console.log(this.token);
 }


 httpOptions = {
   headers: new HttpHeaders({
     'Content-Type': 'application/json',
     'Access-Control-Allow-Origin':'*',
     'Authorization': 'Bearer ' + this.token })
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

  // Ensure the latest token from storage is used for each request
  const currentToken = this.StorageService.getSession("token");
  console.log('Sending JWT:', currentToken);
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + currentToken,
    })
  };
    return this.http.post(
        this.apiURL + 'api/tweets/create',
        body,
        httpOptions
    )
    .pipe(
        catchError(this.handleError)
    );

}
  postReaction(tweetId: number, reactionId: number) {
    const body: ReactionRequest = {
      tweetId: tweetId,
      reactionId: reactionId
    };

    const currentToken = this.StorageService.getSession("token");
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + currentToken,
      })
    };

    return this.http.post(
      this.apiURL + 'api/reactions/create',
      body,
      httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }
  getTweetDetails(id: number): Observable<TweetDetails> {
    const currentToken = this.StorageService.getSession("token");
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + currentToken,
      })
    };

    return this.http.get<TweetDetails>(
      `${this.apiURL}api/tweets/details/${id}`,
      httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

}


