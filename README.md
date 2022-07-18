# AngularApp
A basic Angular Application with standard functionalities like PWA, SSR, GA

# PWA - Progressive Web App

To install PWA to existing project
`ng add @angular/pwa`

Here's a few of the advantages you'll get by converting your Angular application into a progressive web app.

- Insane load-speed performance (when done right).
- A native-like app that can be accessed via a mobile browser or Google Play Store (and Apple Store if you know how to do it).
- App store independence.
- Capable of operating offline (thanks to service workers).
- The ability to send push notifications via the service worker.
- Have a custom splash screen (also known as an app shell in Angular)
- An awesome SEO score - As fast and responsive web page, PWAs have an average SEO score of 85.
- Smaller file size (Native apps tend to require more data to download then a PWA).
- Painless updates (the service worker will automatically update the app in the background without requiring the user to do anything).

The largest disadvantage I'm aware of is that the Apple Store policy does not allow developers to deploy their progressive web app as an app.

## Home Screen
There are a couple of conditions for this to work, one of them being that the application needs to run over HTTPS and have a Service Worker.
And the manifest.webmanifest must be available (should be automatically configured by PWA installation).

Also, the option for installing to Home Screen will only be shown if certain extra conditions are met.
There is a constantly evolving heuristic that will determine if the button "Install To Home Screen" will be shown or no to the user, that typically has to do with the number of times that the user visited the site, how often, etc.

# SSR - Server Side Rendering

To install SSR to existing project
`ng add @nguniversal/express-engine`

This add 3 new angular/cli targets:
- server 
- serve-ssr
- prerender

And 4 new scripts:
- `"dev:ssr": "ng run AngularApp:serve-ssr"` -> Similar as **ng serve but in SSR mode**
- `"serve:ssr": "node dist/AngularApp/server/main.js"` -> Starts the server script for serving the application build locally with SSR
- `"build:ssr": "ng build && ng run AngularApp:server"` -> Builds both the server script and the application in production mode. Use this command when you want to **build the project for deployment**.
- `"prerender": "ng run AngularApp:prerender"` -> Used to prerender an application's pages.

To run SSR use this command:
`npm run dev:ssr`

There are three main reasons to create a Universal version of your application.

- Facilitate web crawlers through search engine optimization (SEO)
- Socia media platforms like Facebook and Twitter can show a preview of the site when shared.
- Improve performance on mobile and low-powered devices
- Show the first page quickly with a first-contentful paint (FCP)

## Limitations

### 1. **Browser API**

Because a Universal application doesn't execute in the browser, some of the browser APIs and capabilities might be missing on the server.

For example, server-side applications can't reference browser-only global objects such as **window**, **document**, **navigator**, or **location**.

#### 1.1 Injectable abstractions
Angular provides some injectable abstractions over these objects, such as **Location** or **DOCUMENT** from ``@angular/common``; it might substitute adequately for these APIs. 
```
// example.service.ts
import { Injectable, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class ExampleService {
  constructor(private location: Location, @Inject(DOCUMENT) private _doc: Document) {}

  public onBackButtonClick() {
	this.location.historyGo(-2);
  }

  getWindow(): Window | null {
    return this._doc.defaultView;
  }

  getLocation(): Location {
    return this._doc.location;
  }

  createElement(tag: string): HTMLElement {
    return this._doc.createElement(tag);
  }
}
```

#### 1.2 Domino
Domino is a Server-side DOM implementation based on Mozilla's dom.js.

```
//server.ts

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
...

    const domino = require('domino');
    const win = domino.createWindow(indexHtml);
    // mock
    global['window'] = win;
    global['document'] = win.document;
    global['navigator'] = win.navigator;

    global['DOMTokenList'] = win.DOMTokenList;
    global['Node'] = win.Node;
    global['Text'] = win.Text;
    global['MouseEvent'] = win.MouseEvent;
    global['Event'] = win.Event;
    global['HTMLElement'] = win.HTMLElement;
    global['navigator'] = win.navigator;
    global['MutationObserver'] = getMockMutationObserver();

    function getMockMutationObserver() {
    return class {
        observe(node, options) {
        }
        disconnect() {
        }
        takeRecords() {
        return [];
        }
    };

    (global as any).WebSocket = require('ws');
    (global as any).XMLHttpRequest = require('xhr2');
}

...
}
```


#### 1.3 Shim
If Angular doesn't provide injectable, it's possible to write new abstractions that delegate to the browser APIs while in the browser and to an alternative implementation while on the server (also known as shimming).
One can do this by importing the functions ``isPlatformBrowser`` and ``isPlatformServer`` from ``@angular/common``, injecting the ``PLATFORM_ID`` token into our component, and running the imported functions to see whether you’re on the server or the browser.

One can bypass if is server or execute only if is browser runtime, and the implementation is not needed or executed at server render time.
```
  private updateOnlineStatus(): void {
    if(isPlatformBrowser(this.platformId)){
        this.isOnline = window && window.navigator.onLine;
    }
  }
```

As last resource, one can do an alternative implementation while on server
```
    getWindow(): any {
        if(isPlatformServer(this.platformId)){
            // any thing or do nothing if it's not necessary at server
        }else{
            //browser
            return window;
        }
    }
```

### 2. **Element Ref**

If we use ElementRef to get a handle on an HTML element, don’t use the **nativeElement** to manipulate the element. Instead, inject **Renderer2**. 

### 3.  **Timeout/Threads**

Try not to use **setTimeout** as much as you can.

### 4. **Absolute URL**

Make all URLs for server requests absolute. Requests for data from relative URLs will fail when running from the server.(requests or assets).

## SEO - Search Engine Optimization

We can use Title and Meta services to populate the title and the description meta tag for one page.

```
    constructor(private title: Title,
                private meta: Meta) {}

    ngOnInit() {
        this.course = this.route.snapshot.data['course'];
        ....
        // SEO metadata
        this.title.setTitle(this.course.description);
        this.meta.addTag({name: 'description', content: this.course.longDescription});
    }
```

Let's remember, the Google Search Engine will be able to use a client-side rendered title and description meta tags, but this is not true for all search engines.

## Integration with Social Media Crawlers

In a similar way to what we did with the SEO meta tags, we can also add other tags that will be used by social media crawlers to help configure what the page will look like on social media.

Twitter example:
```
    // Twitter metadata
      this.meta.addTag({name: 'twitter:card', content: 'summary'});
      this.meta.addTag({name: 'twitter:site', content: '@AngularUniv'});
      this.meta.addTag({name: 'twitter:title', content: this.course.description});
      this.meta.addTag({name: 'twitter:description', content: this.course.description});
      this.meta.addTag({name: 'twitter:text:description', content: this.course.description});
      this.meta.addTag({name: 'twitter:image', content: 'https://avatars3.githubusercontent.com/u/16628445?v=3&s=200'});

```

## Application Shell
In SSR a page is rendered at server side and sent to the client. But if the page should contain many data, ex: a list with hundreds of rows, it's not good to render all that data and send it a big chunk of bytes to the client.
So theres a concept of Application Shell where one can indicate whats prerendered or not using custom strutural directives `appShellRender` and `appShellNotRender`.
```
<div>
    <h1>Title </h1>
    <p>Content</p>
    <table [datasource] *appShellNotRender>
    ...
    </table>
    <loading *appShellRender></loading>
</div>
```

#### appShellRender
Indicate an element that's **only** rendered when rendering occurs. But don't appears at client normal flow.


#### appShellNotRender
Indicate an element that's **not** rendered when rendering occurs.

#### Implementing fine-grained App Shell Directive
This is the appShellRender directive implementation
```
@Directive({
    selector: '[appShellRender]'
})
export class AppShellRenderDirective implements OnInit {
    contructor(
        private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        @Inject(PLATAFORM_ID) private plataformId
    ) {}

    ngOnInit(){
        if (isPlatformServer(plataformId)){
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}
```
As one can see, it's quite simple, so it's easy to create a custom app shell directive to have more flexibility.

## The State Transfer API
After rendering the first page, the client-side is going to startup and fetch again all necessary information. Even the data that's already prerendered.
So we need a way for the universal application to store its data somewhere on the page, and then make it available to the client application, without calling the server again.

Example
```
import {PLATFORM_ID} from '@angular/core';
import {isPlatformServer} from '@angular/common';
import {makeStateKey, TransferState} from '@angular/platform-browser';

@Injectable()
export class CourseResolver implements Resolve<Course> {

    constructor(
        private coursesService: CoursesService,
        @Inject(PLATFORM_ID) private platformId,
        private transferState:TransferState) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {

        const courseId = route.params['id'];
        const COURSE_KEY = makeStateKey<Course>('course-' + courseId);

        if (this.transferState.hasKey(COURSE_KEY)) {
            const course = this.transferState.get<Course>(COURSE_KEY, null);
            this.transferState.remove(COURSE_KEY);
            return of(course);
        }
        else {
            return this.coursesService.findCourseById(courseId)
                .pipe(
                    tap(course => {
                        if (isPlatformServer(this.platformId)) {
                            this.transferState.set(COURSE_KEY, course);
                        }

                    })
                );
        }
    }
}
```

# Build
To build PWA application run (default configuration is production):
`ng build` or `ng build -c production`

To build with SSR execute:
`npm run build:ssr`

To run with SSR execute:
`npm run serve:ssr`

# Deploy
This PWA application can be deploy in any different http server.
Examples:
* IIS
* http-server
* GitHub

## IIS
This project is prepared to be directly deploy in IIS. It contains the necessary web.config file.
Just move all dist/AngularApp files to wwwroot IIS folder, or Add Website at IIS indicating the dist/AngularApp as physical path

## http-server
To install http-server just run:
`npm install -g http-server`

Then run server execute:
`http-server -c-1 .\dist\angular-app\`

Note: `-c-1` disable browser cache (so we can use and test only server worker cache)

## Github
We can use github to deploy our application publicly using  `gh-pages`.
Previously it's necessary to configure [GitHub Pages](https://docs.github.com/en/pages/quickstart)

In this case, one needs to build with base href using same project name
`ng build -c production --base-href=/AngularApp/` 

And to deploy execute:
`npx gh-pages -d dist/angular-app`

Then your application will be deployed to https://username.github.io/repository-name/ page. In this case, it deployed to https://dnlcyan.github.io/AngularApp/

Note: if ngx gh-pages command throws an error, install gh-pages `npm i -D gh-pages`


# Validation
There's different tools and websites to validate the performance and best practices of a website
Like:
•	Synk (se disponivel)
•	https://gtmetrix.com/
•	https://www.webpagetest.org/
•	https://developers.google.com/speed/pagespeed/insights/
•	https://www.ssllabs.com/

But browser DevTool as a **Lighthouse** tool (exists also as Chrome extension) that easily check performance, accessibility, best practices, SEO, and PWA.

#### References:
* https://dev.to/rodrigokamada/adding-the-progressive-web-application-pwa-to-an-angular-application-4g1e (Note: uses incorrectly ng serve to test pwa)
* https://medium.com/ngconf/angular-pwa-install-and-configure-858dd8e9fb07
* https://angular.io/guide/universal
* https://blog.angular-university.io/angular-universal/
* https://medium.com/@raniamagdy95/angular-universal-angular-server-side-rendering-ssr-58e6d6e3ac22 (old version, but good concept insite)
* https://malcoded.com/posts/server-rendering-pitfalls/
* https://medium.com/digital-diplomacy/how-to-enable-server-side-rendering-and-pwa-for-your-angular-app-2831b16fa99b
* https://github.com/angular/universal/blob/main/docs/gotchas.md
* https://github.com/angular/universal/issues/830 (window is not defined)
