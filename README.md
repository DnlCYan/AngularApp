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


# Build
To build the application run (default configuration is production):
`ng build` or `ng build -c production`

# Deploy
This PWA application can be deploy in any different http server.
Examples:
* IIS
* http-server
* GitHub

## IIS
This project is prepared to be directly deploy in IIS. It contains the necessary web.config file.
Just move all dist/AngularApp files to wwwroot IIS folder, or Add Website at IIS indicating the disct/AngularApp as physical path

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


References:
* https://dev.to/rodrigokamada/adding-the-progressive-web-application-pwa-to-an-angular-application-4g1e (Note: uses incorrectly ng serve to test pwa)
* https://medium.com/ngconf/angular-pwa-install-and-configure-858dd8e9fb07
