import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-new-tweet',
  templateUrl: './new-tweet.component.html',
  styleUrls: ['./new-tweet.component.css']
})
export class NewTweetComponent {
  tweetText: string = '';
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  apiURL = 'http://localhost:8080'; // <--- Agrega esto

  constructor(private http: HttpClient) {}

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  createTweet() {
    if (this.selectedImage) {
      const formData = new FormData();
      formData.append('image', this.selectedImage);
      this.http.post<{ imageUrl: string } | string>(
        this.apiURL + '/api/tweets/upload-image', // <--- Usa la URL absoluta
        formData,
        { responseType: 'text' as 'json' }
      )
      .subscribe((res: any) => {
        const imageUrl = typeof res === 'string' ? res : (res.imageUrl || '');
        this.sendTweet(imageUrl);
      });
    } else {
      this.sendTweet('');
    }
  }

  sendTweet(imageUrl: string) {
    const tweetPayload = {
      tweet: this.tweetText,
      imageUrl: imageUrl
    };
    this.http.post(
      this.apiURL + '/api/tweets/create', // <--- Usa la URL absoluta
      tweetPayload
    )
    .subscribe(() => {
      this.tweetText = '';
      this.selectedImage = null;
      this.imagePreview = null;
      // ...any additional logic (e.g., refresh tweets)...
    });
  }
}
