import { HttpResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { StressrService } from "./stressr.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  isRunning = false;
  url = "https://wasmify.azurewebsites.net/api/wasm_gen";
  stressOperation: Subscription = null;
  counter = {
    success: 0,
    error: 0,
    responseTimeAvg: 0
  };
  results: HttpResponse<any>[] = [];

  constructor(private readonly stressr: StressrService) {}

  load() {
    this.stressOperation = this.stressr
      .load(this.url, {
        interval: 1000
      })
      .subscribe(
        (response: HttpResponse<any>) => {
          console.log("data", response);
          this.isRunning = true;

          if (response.status === 200 && response.type === 4) {
            this.counter.success++;
            this.results.push(response);
            this.computeAvgResponseTime();
          }
        },
        error => {
          this.counter.error++;
          this.isRunning = false;
          this.results.push(error);
          console.log("error", error);
        },
        () => {
          this.isRunning = false;
          console.log("done");
        }
      );
  }

  stop() {
    this.stressOperation.unsubscribe();
    this.isRunning = false;
  }

  private computeAvgResponseTime() {
    this.counter.responseTimeAvg = Math.floor(
      this.results.reduce(
        (acc, res) => (res.headers as any).__responseTime + acc,
        0
      ) / this.results.length
    );
  }
}
