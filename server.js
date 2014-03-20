var Server = require('express-scaffold');
var secret = 'secret here';

var sample = [{
    lng: 112.359673,
    lat: 34.604702,
    message: "内容1",
    focus: true
}, {
    lng: 112.159673,
    lat: 34.104702,
    message: "内容2"
}];

module.exports = server;

function server() {
    return new Server({
        port: 8888,
        name: 'Geo Map',
        views: './views',
        public: './public',
        database: {
            name: 'geomap'
        }
    })
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
                return res.json({
                    stat: 'ok',
                    created: new Date(),
                    content: sample
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
            if (!token || token !== secret) return next(new Error('token required'));
            var cache = req.body.cache;
            ctrlers.cache.create(cache, function(err, baby) {
                if (err) return next(err);
                console.log(baby)
                res.json({
                    stat: 'ok',
                    baby: baby._id
                });
            })
        });

    })
    .run();
}