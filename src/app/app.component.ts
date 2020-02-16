import { Component } from '@angular/core';
import { StressrService } from './stressr.service';
import { Observable, Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isRunning = false;
  url = 'https://wasmify.azurewebsites.net/api/wasm_gen';
  operation: Subscription = null;
  results: any[] = [];

  constructor(private readonly stressr: StressrService) {

  }
  load() {
    this.operation = this.stressr.load(this.url, {
      interval: 1000
    }).subscribe(
      (response: HttpResponse<any>) => {
        this.isRunning = true;
        console.log('data', response);

        if (response.status === 200 && response.type === 4) {
          this.results.push((response.headers as any).__endTime);
        }
      },
      error => {
        this.isRunning = false;
        this.results.push((error.headers as any).__endTime);
        console.log('error', error);
      },
      () => {
        this.isRunning = false;
        console.log('done');
      }
    );
  }

  stop() {
    this.operation.unsubscribe();
    this.isRunning = false;
  }
}
