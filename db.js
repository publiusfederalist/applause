const fs = require('fs');
const mysql = require('mysql');

class DB {
  constructor() {
    this.connection = mysql.createConnection({
      host: '127.0.0.1',
      user: 'applause',
      password: fs.readFileSync(__dirname+"/secrets/db.secret").toString().trim(),
      database: 'applause',
      charset: "utf8mb4"
    });
    this.connection.connect();
    this.query = this.connection.query.bind(this.connection);
    this.close = this.connection.end.bind(this.connection);
  }

  async signatureExists(type,signature) {
    return new Promise(async (resolve,reject) => {
      this.query("SELECT * FROM ?? WHERE signature = ?",[type,signature],(error,results) => {
        if(error)
          return resolve({error:error});
        if(results.id)
          return resolve(true);
        return resolve(false);
      });
    });
  }
  async publish(user, message, signature) {
    let exists = await this.signatureExists("POSTS",signature);
    if(!exists) {
      return new Promise(async (resolve,reject) => {
        this.query("INSERT INTO POSTS (user, message, signature, timestamp) VALUES (?,?,?,?)",[user,message,signature,this.date()],(error,results) => {
          if(error)
            return resolve({error:error});
          return resolve(results);
        });
      });
    }
    else
      return {error:'exists'};
  }
  async applause(user, target, signature) {
    let exists = await this.signatureExists("APPLAUSE",signature);
    let postExists = await this.getPost(target);
    if(!postExists.id)
      return {error:'no target'};
    else if(!exists) {
      return new Promise(async (resolve,reject) => {
        this.query("INSERT INTO APPLAUSE (tid, user, signature, timestamp) VALUES (?,?,?,?)",[target,user,signature,this.date()],(error,results) => {
          if(error)
            return resolve({error:error});
          return resolve(results);
        });
      });
    }
    else
      return {error:'exists'};
  }
  async getPost(id) {
    return new Promise(async (resolve,reject) => {
      this.query("SELECT * FROM POSTS WHERE id = ?",[id],(error,results) => {
        if(error)
          return resolve({error:error});
        if(results[0] && results[0].id)
          return resolve(results[0]);
        else
          return resolve({error:"not found"});
      });
    });
  }
  async getPostBySig(sig) {
    return new Promise(async (resolve,reject) => {
      this.query("SELECT * FROM POSTS WHERE signature = ?",[sig],(error,results) => {
        if(error)
          return resolve({error:error});
        if(results[0] && results[0].id)
          return resolve(results[0]);
        else
          return resolve({error:"not found"});
      });
    });
  }
  async getPostsByRecent() {
    return new Promise(async (resolve,reject) => {
      this.query("SELECT * FROM POSTS WHERE 1 ORDER BY timestamp DESC LIMIT 0,250",(error,results) => {
        if(error)
          return resolve({error:error});
        if(results[0] && results[0].id)
          return resolve(results);
        else
          return resolve({error:"not found"});
      });
    });
  }
  async getApplause(id) {
    return new Promise(async (resolve,reject) => {
      this.query("SELECT * FROM APPLAUSE WHERE tid = ?",[id],(error,results) => {
        if(error)
          return resolve({error:error});
        return resolve(results);
      });
    });
  }
  // Utilities
  date() {
    return parseInt(Date.now() / 1000)
  }
}

module.exports = new DB();
