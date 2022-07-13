# AngularApp
A basic Angular Application with standard functionalities like PWA, SSR, GA

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
