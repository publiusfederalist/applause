const moment = require('moment');
const fs = require('fs');
const app = require('./express.js');
const verify = require('./hsverify.js');
const DB = require('./db.js');

function error(message) { return fs.readFileSync(__dirname+"/www/error.html").toString().replace("ERROR",message); }
app.get('/', async (req, res, next) => {
  let posts = await DB.getPostsByRecent();
  let _posts = [];
  if(posts.length>0) {
    posts.forEach((post)=> {
      let firstline;
      if(post.message.includes('\r'))
        firstline = post.message.substr(0,(post.message.indexOf("\r")));
      else
        firstline = post.message;
      _posts.push({
        title:firstline.substr(0,256),
        poster:post.user,
        id:post.id,
        timestamp:moment(post.timestamp*1000).fromNow()
      })
    });
  }
  res.send(fs.readFileSync(__dirname+'/www/index.html').toString().replace('POSTS',JSON.stringify(_posts)));
});
app.get('/p', (req, res, next) => { res.sendFile(__dirname+'/www/publish.html') });
app.get('/v/:postId', async (req, res, next) => {
  let result = await DB.getPost(req.params.postId);
  if(result.error)
    res.send(error("Page not found"));
  else {
    let applause = await DB.getApplause(req.params.postId);
    let applause_json = [];
    applause.forEach((aApplause)=>{
      let _app = {
        name:aApplause.user,
        signature:aApplause.signature,
        timestamp:aApplause.timestamp
      };
      applause_json.push(_app);
    });
    res.send(fs.readFileSync(__dirname+"/www/view.html").toString().replaceAll("NAME",result.user).replace("MESSAGE",result.message).replace("SIGNATURE",result.signature).replace("TIME",result.timestamp).replace("TARGET",req.params.postId).replace("APPLAUSE",JSON.stringify(applause_json)));
  }
});
app.get('/s/:postSig', async (req, res, next) => {
  let result = await DB.getPostBySig(req.params.postSig);
  if(result.error)
    res.send(error("Page not found"));
  else
    res.redirect(`/v/${result.id}`);
});
app.post('/publish', async (req, res, next) => {
  let {name, message, signature} = req.body;
  if(await verify(name, message, signature)) {
    let result = await DB.publish(name,message,signature);
    if(result.error)
      res.redirect(`/s/${signature}`);
    else
      res.redirect(`/v/${result.insertId}`);
  }
  else
    res.send(error("Invalid signature"));
});
app.post('/applause', async (req, res, next) => {
  let {name, message, signature, target} = req.body;
  if(await verify(name, message, signature)) {
    let result = await DB.applause(name, target, signature);
    if(result.error==='no target')
      res.send(error("Target ID not found"));
    else
      res.redirect(`/v/${target}`);
  }
  else
    res.send(error("Invalid signature"));
});
app.get('*', (req, res, next) => { res.send(error("Page not found")) });

process.on('uncaughtException', (err, origin) => {
  console.error(`${parseInt(Number(new Date()) / 1000)} # Serious problem (${origin}) ${err.stack}`);
});
