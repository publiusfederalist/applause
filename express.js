const fs = require('fs');
const csrf = require('csurf');
const http = require('http');
const https = require('https');
const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({secret:fs.readFileSync(__dirname+"/secrets/session.password","utf-8").toString().trim(), resave: true, saveUninitialized:true}))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended:true}));
var csrfProtection = csrf({ cookie: false });
app.use(csrfProtection);

const options = {
  cert: fs.readFileSync(__dirname+'/ssl/fullchain.pem'),
  key: fs.readFileSync(__dirname+'/ssl/privkey.pem')
};

app.use(function(err, req, res, next) {
  if(err.code !== 'EBADCSRFTOKEN') return next(err);
  res.status(403);
  res.json({err: "CSRF ERROR"});
});
app.get('/csrf', (req, res) => {
  res.send(req.csrfToken());
  res.end();
})
app.use('/static', express.static(__dirname+'/static'));

http.createServer((req,res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(8080);
let httpsServer = https.createServer(options, app);
httpsServer.listen(8443);

module.exports = app;
