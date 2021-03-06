var Server = require('express-scaffold');
var configs = require('./configs');

module.exports = server;

function server() {
  return new Server(configs)
  .models(function(db, Schema) {
    var cacheModel = new Schema({
      content: [],
      created: {
        type: Date,
        default: Date.now
      },
    });
    return {
      cache: db.model('cache', cacheModel)
    }
  })
  .ctrlers(function(models, Ctrler) {
    var Cache = new Ctrler(models.cache);
    var cache = models.cache;
    Cache.latest = function(callback) {
      return cache.findOne({}).sort('-created').exec(callback);
    }
    return {
      cache: Cache
    }
  })
  .routes(function(app, ctrlers) {

    app.get('/', function(req, res, next) {
      res.render('map');
    });

    /**
     *
     * @GET: /cache
     * output GeoJson data
     *
     **/

    app.get('/cache', function(req, res, next) {
      ctrlers.cache.latest(function(err, cache) {
        if (err) return next(err);
        var result = cache ? cache : {};
        return res.json({
          stat: 'ok',
          cache: cache
        });
      });
    });

    /**
     *
     * @POST: /cache
     * save cache and parse them to GeoJson
     *
     **/

    app.post('/cache', function(req, res, next) {
      var token = req.body.token;
      if (!req.body.cache) return next(new Error('contents required'));
      if (!token || token !== configs.token) return next(new Error('token required'));
      var cache = req.body.cache;
      if (cache.length === 0) return next(new Error('contents required'));
      var baby = {};
      try {
        baby.content = JSON.parse(cache);
      } catch (err) {
        return next(new Error('cache fomat is invalid!'));
      }
      ctrlers.cache.create(baby, function(err, baby) {
        if (err) return next(err);
        res.json({
          stat: 'ok',
          baby: baby._id
        });
      })
    });

  })
  .run();
}