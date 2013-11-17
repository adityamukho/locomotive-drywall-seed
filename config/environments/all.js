var express = require('express'),
  poweredBy = require('connect-powered-by'),
  passport = require('passport'),
  mongoStore = require('connect-mongo')(express),
  util = require('util');

var config = {};
config.mongodb = {
  uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost/drywall'
};
config.cryptoKey = 'k3yb0ardc4t';
config.companyName = 'Acme, Inc.';
config.projectName = 'Drywall';
config.systemEmail = 'your@email.addy';
config.smtp = {
  from: {
    name: process.env.SMTP_FROM_NAME || config.projectName + ' Website',
    address: process.env.SMTP_FROM_ADDRESS || 'your@email.addy'
  },
  credentials: {
    user: process.env.SMTP_USERNAME || 'your@email.addy',
    password: process.env.SMTP_PASSWORD || 'bl4rg!',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    ssl: true
  }
};
config.oauth = {
  twitter: {
    key: process.env.TWITTER_OAUTH_KEY || '',
    secret: process.env.TWITTER_OAUTH_SECRET || ''
  },
  facebook: {
    key: process.env.FACEBOOK_OAUTH_KEY || '',
    secret: process.env.FACEBOOK_OAUTH_SECRET || ''
  },
  github: {
    key: process.env.GITHUB_OAUTH_KEY || '',
    secret: process.env.GITHUB_OAUTH_SECRET || ''
  }
};

module.exports = function() {
  // Warn of version mismatch between global "lcm" binary and local installation
  // of Locomotive.
  if (this.version !== require('locomotive').version) {
    console.warn(util.format('version mismatch between local (%s) and global (%s) Locomotive module', require('locomotive').version, this.version));
  }

  // Configure application settings.  Consult the Express API Reference for a
  // list of the available [settings](http://expressjs.com/api.html#app-settings).
  this.set('views', __dirname + '/../../app/views');
  this.set('view engine', 'jade');
  this.set('project-name', config.projectName);
  this.set('company-name', config.companyName);
  this.set('system-email', config.systemEmail);
  this.set('crypto-key', config.cryptoKey);
  this.set('require-account-verification', true);

  //smtp settings
  this.set('smtp-from-name', config.smtp.from.name);
  this.set('smtp-from-address', config.smtp.from.address);
  this.set('smtp-credentials', config.smtp.credentials);

  //twitter settings
  this.set('twitter-oauth-key', config.oauth.twitter.key);
  this.set('twitter-oauth-secret', config.oauth.twitter.secret);

  //github settings
  this.set('github-oauth-key', config.oauth.github.key);
  this.set('github-oauth-secret', config.oauth.github.secret);

  //facebook settings
  this.set('facebook-oauth-key', config.oauth.facebook.key);
  this.set('facebook-oauth-secret', config.oauth.facebook.secret);

  // Register JADE as a template engine.
  this.engine('jade', require('jade').__express);

  this.datastore(require('locomotive-mongoose'));
  this.sessionStore = new mongoStore({
    url: config.mongodb.uri
  });

  // Override default template extension.  By default, Locomotive finds
  // templates using the `name.format.engine` convention, for example
  // `index.html.ejs`  For some template engines, such as Jade, that find
  // layouts using a `layout.engine` notation, this results in mixed conventions
  // that can cuase confusion.  If this occurs, you can map an explicit
  // extension to a format.
  this.format('html', {
    extension: '.jade'
  });

  // Register formats for content negotiation.  Using content negotiation,
  // different formats can be served as needed by different clients.  For
  // example, a browser is sent an HTML response, while an API client is sent a
  // JSON or XML response.
  /* this.format('xml', { engine: 'xmlb' }); */

  // Use middleware.  Standard [Connect](http://www.senchalabs.org/connect/)
  // middleware is built-in, with additional [third-party](https://github.com/senchalabs/connect/wiki)
  // middleware available as separate modules.
  this.use(poweredBy('Locomotive'));
  this.use(express.logger());
  this.use(express.favicon('/../../public/favicon.ico'));
  this.use(express.static(__dirname + '/../../public'));
  this.use(express.bodyParser());
  this.use(express.methodOverride());
  this.use(express.cookieParser());
  this.use(express.session({
    secret: config.cryptoKey,
    store: this.sessionStore
  }));
  this.use(passport.initialize());
  this.use(passport.session());
  this.use(this.router);

  //global locals
  this.locals.projectName = this.get('project-name');
  this.locals.copyrightYear = new Date().getFullYear();
  this.locals.copyrightName = this.get('company-name');
  this.locals.cacheBreaker = 'br34k-01';

  //Store config object as well
  this.locals.config = config;

  //error handler
  this.use(function(err, req, res, next) {
    res.status(500);
    if (req.xhr) {
      res.send({
        error: 'Something went wrong.'
      });
    } else {
      res.render('http/500');
    }
    console.log(err.stack);
  });
}