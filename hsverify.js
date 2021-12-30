const fs = require('fs');
const {NodeClient} = require('hs-client');
const {Network} = require('hsd');
const network = Network.get('main');

const client = new NodeClient({
  network: network.type,
  port: network.rpcPort,
  apiKey: fs.readFileSync(__dirname+"/secrets/hsd.key").toString().trim()
});

async function verify(name,message,signature) {
  return await client.execute('verifymessagewithname', [name, signature, message.replaceAll("\r","")]);
}

module.exports = verify;
