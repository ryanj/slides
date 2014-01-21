var crypto = require('crypto');
var fs = require('fs');

function createHash(secret) {
  var cipher = crypto.createCipher('blowfish', secret);
  return(cipher.final('hex'));
};

function generateKey(){
  var hostnm = process.env.OPENSHIFT_APP_NAME || '127.0.0.1:3000';
  var key = {};
  if(typeof(process.env.SLIDESHOW_ID)     == 'undefined' 
  || typeof(process.env.SLIDESHOW_SECRET) == 'undefined'
  ){
    var ts = new Date().getTime();
    var rand = Math.floor(Math.random()*9999999);
    var secret = ts.toString() + rand.toString();

    key.secret = secret;
    key.id = createHash(secret);
    console.log('GENERATING NEW SLIDESHOW SECRET: ');
  }else{
    console.log("Reusing existing secret tokens: ");
    key.id = process.env.SLIDESHOW_ID;
    key.secret = process.env.SLIDESHOW_SECRET;
  }
  key_string = JSON.stringify(key);
  //fs.writeFileSync(__dirname + '/config/sockets.json', key_string );
  tacky_global = "window.key_id = '"+key.id+"';";
  path = __dirname + '/key_id.js';
  console.log("path is:");
  console.log(path);
  fs.writeFileSync(path, tacky_global);
  console.log(key_string);
  console.log("Configure your browser to be the presenter by clicking on the following link: ");
  console.log("http://" + hostnm + "/#setToken-" + key.id);
  console.log("localStorage['secret'] = '" + key_string + "';" );
}

module.exports = exports = {
  create_hash: createHash,
  generate: generateKey,
};
