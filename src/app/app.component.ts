import { Component, OnInit } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  isOnline: boolean;
  modalVersion: boolean;
  modalPwaEvent: any;
  modalPwaPlatform: string | undefined;

  constructor(private platform: Platform,
    private swUpdate: SwUpdate) {
    this.isOnline = false;
    this.modalVersion = false;
  }

  public ngOnInit(): void {
    this.updateOnlineStatus();

    console.info(`platform: ${JSON.stringify(this.platform)}`);

    window.addEventListener('online', this.updateOnlineStatus.bind(this));
    window.addEventListener('offline', this.updateOnlineStatus.bind(this));

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
    this.isOnline = window.navigator.onLine;
    console.info(`isOnline=[${this.isOnline}]`);
  }

  public updateVersion(): void {
    this.modalVersion = false;
    window.location.reload();
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