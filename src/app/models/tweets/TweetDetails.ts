
import { Comment } from './Comment';
import { Reaction } from './Reaction';

export class TweetDetails {
  tweetId: number = 0;
  tweetContent: string = '';
  comments: Comment[] = [];
  reactions: Reaction[] = [];
}
