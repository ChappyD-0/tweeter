import { Component } from '@angular/core';
import { StorageService } from "../services/storage.service";
import { TweetService } from '../services/tweet.service';
import { Tweet } from '../models/tweets/Tweet';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    username : String = "";
    tweetText : String = "";
    tweets:Tweet[] = [];
    constructor( private storageService : StorageService,
                 private tweetService: TweetService
               )
    {
       this.username = this.storageService.getSession("user");
       console.log(this.username);
       this.getTweets();
    }

    private getTweets()
{
  this.tweetService.getTweets().subscribe((tweets: any) => {
     this.tweets = tweets.content;
     console.log(this.tweets);
   });
 }

public addTweet()
 {
  this.tweetService.postTweet(this.tweetText).subscribe((tweet: any) => {
     console.log(tweet);
     this.getTweets();

   });

 }
}
