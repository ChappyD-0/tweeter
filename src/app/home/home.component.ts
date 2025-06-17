import { Component } from '@angular/core';
import { Canvas } from 'glsl-canvas-js/dist/esm/glsl';
import { StorageService } from "../services/storage.service";
import { TweetService } from '../services/tweet.service';
import { Tweet } from '../models/tweets/Tweet';
import { TweetDetails } from '../models/tweets/TweetDetails';
import { Reaction } from '../models/tweets/Reaction';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    private glsl?: Canvas;
    username : String = "";
    tweetText : string = '';
    selectedImage: File | null = null;
    imagePreview: string | ArrayBuffer | null = null;
    tweets:Tweet[] = [];
    tweetDetails: { [key: string]: any } = {};
    newComments: { [key: number]: string } = {};
    reactionTypes = [
    { id: 1, icon: '👍' },
    { id: 2, icon: '❤️' },
    { id: 3, icon: '💔' },
    { id: 4, icon: '😢' },
    { id: 5, icon: '😡' },
    ];
    apiURL = 'http://localhost:8080';
    constructor( private storageService : StorageService,
                 private tweetService: TweetService,
                 private http: HttpClient
               )
    {
       this.username = this.storageService.getSession("user");
       console.log(this.username);
       this.getTweets();
    }
  addComment(tweetId: number) {
    const content = this.newComments[tweetId];
    if (!content || content.trim() === '') {
      return;
    }
    this.tweetService.postComment(tweetId, content).subscribe(() => {
      this.newComments[tweetId] = '';
      this.loadDetails(tweetId);
    });
  }



    private getTweets()
{
  this.tweetService.getTweets().subscribe((tweets: any) => {
     this.tweets = tweets.content;
     console.log(this.tweets);
     this.tweets.forEach(tweet => this.loadDetails(Number(tweet.id)));
   });
 }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

 public addTweet() {
      const currentToken = this.storageService.getSession("token");
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + currentToken
        })
      };

      if (this.selectedImage) {
        const formData = new FormData();
        formData.append('image', this.selectedImage);
        this.http.post<{ imageUrl: string } | string>(
          this.apiURL + '/api/tweets/upload-image',
          formData,
          {
            headers: httpOptions.headers,
            responseType: 'text' as 'json'
          }
        )
        .subscribe((res: any) => {
          const imageUrl = typeof res === 'string' ? res : (res.imageUrl || '');
          this.sendTweetWithImage(imageUrl, httpOptions);
        });
      } else {
        this.sendTweetWithImage('', httpOptions);
      }
    }

    sendTweetWithImage(imageUrl: string, httpOptions: any) {
      const tweetPayload = {
        tweet: this.tweetText,
        imageUrl: imageUrl
      };
      this.http.post(
        this.apiURL + '/api/tweets/create',
        tweetPayload,
        httpOptions
      )
      .subscribe(() => {
        this.tweetText = '';
        this.selectedImage = null;
        this.imagePreview = null;
        this.getTweets();
      });
    }

  private loadDetails(id: number) {
    this.tweetService.getTweetDetails(id).subscribe((details: TweetDetails) => {
      this.tweetDetails[id] = details;
    });
  }
  addReaction(tweetId: number, reactionId: number) {
    this.tweetService.postReaction(tweetId, reactionId).subscribe(() => {
      this.loadDetails(tweetId);
    });
  }
  countReactions(reactions: Reaction[], reactionId: number): number {
    return reactions.filter(r => r.reactionId === reactionId).length;
  }

  protected readonly Number = Number;
}
