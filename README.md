# Blending Web 2/3, is this Web .666? ( •̀ᴗ•́ )و ̑̑

## Learn more by joining the [Handshake Discord Community](https://discord.gg/tXJ2UdGuda)

applause is a platform I built using centralized web technologies in combination with decentralized identity blockchain. The result is a website that requires no login or signup of any kind, and instead, lets users participate by authenticating their actions against the key associated with their name on the [Handshake](https://handshake.org/) blockchain.

## Live

You can see this live at [https://applause.chat/](https://applause.chat/).

## Why

I was browsing some of the Handshake related projects on Github and saw a recent [pull request](https://github.com/kyokan/bob-extension/pull/15) on Kyokan's Bob Wallet Extension. Highly interested, I downloaded and built the branch and started building this site.

## Use Cases

There are several use cases:

- Authenticated paste bin
- Easy blogging
- Petition
- Transparent voting
- and more!

You can embed images by using the data-url with markdown image syntax.

## On blending Web 2 and 3

A lot of Web3 projects are geared around making money. I'm more interested in decentralization and sovereign data ownership, so I'm exploring how we can use these technologies for better purposes.

## Technologies Used

- nodeJS + Express + Session + CSRF + moment
- mySQL
- Handshake
- Linux

## Installation
1. Clone
```
git clone https://github.com/publiusfederalist/applause
```

2. Install npm packages
```
cd applause
npm install mysql csurf express express-session hs-client hsd moment
```

3. Setup and install mysql

4. Setup an 'applause' db and a mysql user with access to the 'applause' db and setup these tables:
```
CREATE TABLE POSTS (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user VARCHAR(253) NOT NULL,
  message LONGTEXT NOT NULL,
  signature VARCHAR(89) NOT NULL UNIQUE,
  timestamp INT NOT NULL
);
CREATE TABLE APPLAUSE (
  aid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tid INT NOT NULL,
  user VARCHAR(253) NOT NULL,
  signature VARCHAR(89) NOT NULL UNIQUE,
  timestamp INT NOT NULL
);
```
5. Setup iptables forwards
```
#!/bin/sh
iptables -t nat -F
iptables -F

echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward
iptables -t nat -I PREROUTING --src 0/0 --dst x.x.x.x -p tcp --dport 80 -j REDIRECT --to-ports 8080
iptables -t nat -I PREROUTING --src 0/0 --dst x.x.x.x -p tcp --dport 443 -j REDIRECT --to-ports 8443
```

6. Get let's encrypt certs and place in the ssl folder

7. Setup secrets files `db.secret` for the database password, `hsd.key` for the hsd api, and `session.password` for the http session.

8. Setup a fullnode Handshake daemon

9. Run `node server.js`

## Copyright and License

MIT Licensed

