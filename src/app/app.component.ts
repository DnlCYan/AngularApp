import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  isOnline: boolean = false;
  modalVersion: boolean = false;
  modalPwaEvent: any;
  modalPwaPlatform: string | undefined;
  
  constructor(private ngZone: NgZone, private router: Router,
    private platform: Platform,
    private swUpdate: SwUpdate, @Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          ga('set', 'page', event.urlAfterRedirects);
          ga('send', 'pageview');
        }
      });
    }
  
    this.isOnline = false;
    this.modalVersion = false;
  }

  public ngOnInit(): void {
    this.updateOnlineStatus();

    console.info(`platform: ${JSON.stringify(this.platform)}`);

    if (isPlatformBrowser(this.platformId)) {
      window && window.addEventListener('online', this.updateOnlineStatus.bind(this));
      window && window.addEventListener('offline', this.updateOnlineStatus.bind(this));
    }

    if (this.swUpdate.isEnabled) { //Must run on production mode to be activated (app.module)

      const updatesAvailable = this.swUpdate.versionUpdates.pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        map(evt => ({
          type: 'UPDATE_AVAILABLE',
          current: evt.currentVersion,
          available: evt.latestVersion,
        })));

      updatesAvailable.subscribe((evt) => {

        console.info(`currentVersion=[${JSON.stringify(evt.current)} | latestVersion=[${JSON.stringify(evt.available)}]`);
        this.modalVersion = true;
        // if (confirm("New version available. Load New Version?")) {
        // 
        // window.location.reload();
        // }
      });
    }
  }

  /**
   * VERSION UPDATE
   */
  private updateOnlineStatus(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isOnline = window && window.navigator.onLine;
      console.info(`isOnline=[${this.isOnline}]`);
    }
  }

  public updateVersion(): void {
    this.modalVersion = false;
    if (isPlatformBrowser(this.platformId)) {
      window && window.location.reload();
    }
  }

  public closeVersion(): void {
    this.modalVersion = false;
  }

  // /**
  //  * ADD TO HOME - NO NEED em recent angular versions
  //  */
  //  private loadModalPwa(): void {
  //   if (this.platform.ANDROID) {
  //     window.addEventListener('beforeinstallprompt', (event: any) => {
  //       event.preventDefault();
  //       this.modalPwaEvent = event;
  //       this.modalPwaPlatform = 'ANDROID';
  //     });
  //   }

  //   if (this.platform.IOS && this.platform.SAFARI) {
  //     const isInStandaloneMode = ('standalone' in window.navigator) && ((<any>window.navigator)['standalone']);
  //     if (!isInStandaloneMode) {
  //       this.modalPwaPlatform = 'IOS';
  //     }
  //   }
  // }

  // public addToHomeScreen(): void {
  //   this.modalPwaEvent.prompt();
  //   this.modalPwaPlatform = undefined;
  // }

  // public closePwa(): void {
  //   this.modalPwaPlatform = undefined;
  // }

}