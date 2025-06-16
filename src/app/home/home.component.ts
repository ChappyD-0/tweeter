import { Component } from '@angular/core';
import { Canvas } from 'glsl-canvas-js/dist/esm/glsl';
import { StorageService } from "../services/storage.service";
import { TweetService } from '../services/tweet.service';
import { Tweet } from '../models/tweets/Tweet';
import { TweetDetails } from '../models/tweets/TweetDetails';
import { Reaction } from '../models/tweets/Reaction';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    private glsl?: Canvas;
    username : String = "";
    tweetText : String = "";
    tweets:Tweet[] = [];
    tweetDetails: { [key: string]: any } = {};
    reactionTypes = [
    { id: 1, icon: '👍' },
    { id: 2, icon: '❤️' },
    { id: 3, icon: '💔' },
    { id: 4, icon: '😢' },
    { id: 5, icon: '😡' },
    ];
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
     this.tweets.forEach(tweet => this.loadDetails(Number(tweet.id)));
   });
 }

public addTweet()
 {
  this.tweetService.postTweet(this.tweetText).subscribe((tweet: any) => {
     console.log(tweet);
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
