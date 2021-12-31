const fs = require('fs');
const {NodeClient} = require('hs-client');
const {Network} = require('hsd');
const network = Network.get('main');
const punycode = require('punycode');

const client = new NodeClient({
  network: network.type,
  port: network.rpcPort,
  apiKey: fs.readFileSync(__dirname+"/secrets/hsd.key").toString().trim()
});

async function verify(name,message,signature) {
  console.log(name, message, signature);
  if(name.length==0 || name.includes(' '))
    return false;
  if(Buffer.from(signature, 'base64').toString('base64') === signature)
    return await client.execute('verifymessagewithname', [punycode.toASCII(name), signature, message.replaceAll("\r","")]);
  return false;
}

module.exports = verify;
