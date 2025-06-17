import { AfterViewInit, Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'tweeter';
  private intervalId: any;

  ngAfterViewInit() {
    const text = document.getElementById('animated-title');
    let shadowSize = 3;
    let shadows = '';

    this.intervalId = setInterval(() => {
      const direction = Math.floor(Math.random() * 4);
      const color = this.getRandomColor();
      let newShadow = '';
      switch (direction) {
        case 0:
          newShadow = `${shadowSize}px ${shadowSize}px 0px ${color}`;
          break;
        case 1:
          newShadow = `${-shadowSize}px ${shadowSize}px 0px ${color}`;
          break;
        case 2:
          newShadow = `${shadowSize}px ${-shadowSize}px 0px ${color}`;
          break;
        case 3:
          newShadow = `${-shadowSize}px ${-shadowSize}px 0px ${color}`;
          break;
      }
      shadows += (shadows ? ', ' : '') + newShadow;
      if (text) text.style.textShadow = shadows;
      shadowSize += 30;
      if (shadowSize > 300) {
        shadows = '';
        shadowSize = 3;
      }
    }, 100);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
