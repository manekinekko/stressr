import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: `root`
})
export class StressrService {
  constructor(private readonly http: HttpClient) {}

  load(url: string, {interval} = {interval: 5000}) {
    return timer(0, interval).pipe(
      mergeMap(_ => this.httpGet(url),
    ));
  }
  private httpGet(url: string) {
    const startTime = Date.now();
    const req = new HttpRequest(`GET`, url, {
      reportProgress: true,
      responseType: `json`,
    });
    return this.http.request(req).pipe(
      map((response: HttpResponse<any>) => {
        if (response.headers) {
          (response.headers as any).__responseTime = Date.now() - startTime;
        }
        return response;
      })
    );
  }
}
