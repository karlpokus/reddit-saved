var Snoocore = require('snoocore'),
    settings = require(process.env.HOME + '/reddit-settings.json'),
    api = new Snoocore({
      userAgent: "reddit-saved",
      oauth: {
        key: settings.key,
        secret: settings.secret,
        username: settings.username,
        password: settings.password,
        type: 'script',
        scope: ['identity', 'history', 'read']
      }
    }),
    urlSaved = '/user/' + settings.username + '/saved',
    n = 1,
    onlyPreviewUrl = true;

function getPreviews(res) {
  return res.data.children
    .map(function(o){
      
      if (o.data.preview && o.data.preview.enabled) {
        if (o.data.preview.images[0].variants.gif) {
          // we have a gif
          return o.data.preview.images[0].variants.gif.source.url;
          
        } else {
          // img
          return o.data.preview.images[0].source.url;
        }
        
      } else if (o.data.url) {
        // some other
        return o.data.url
        
      } else {
        return null;
      }
    });
}

function main(url, n, onlyPreviewUrl, cb) {
  api(url)
    .get({limit: n})
    .then(function(res) {
      
      if (!onlyPreviewUrl) {
        return cb(null, res.data.children[0].data);
      }
      cb(null, getPreviews(res));
    });
}

main(urlSaved, n, onlyPreviewUrl, function(err, data){
  if (!err) {
    console.log(data);
  }
});
