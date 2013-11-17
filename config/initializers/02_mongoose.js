var mongoose = require('mongoose');

module.exports = function(done) {
  //setup mongoose
  this.db = mongoose.createConnection(this.locals.config.mongodb.uri);
  this.db.on('error', console.error.bind(console, 'mongoose connection error: '));
  this.db.once('open', function() {
    //and... we have a data store
  });

  //embeddable docs first
  require('../../schema/Note')(this, mongoose);
  require('../../schema/Status')(this, mongoose);
  require('../../schema/StatusLog')(this, mongoose);
  require('../../schema/Category')(this, mongoose);

  //then regular docs
  require('../../schema/User')(this, mongoose);
  require('../../schema/Admin')(this, mongoose);
  require('../../schema/AdminGroup')(this, mongoose);
  require('../../schema/Account')(this, mongoose);

  done();
}