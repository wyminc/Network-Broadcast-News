const net = require("net");

//ec2
// const client = net.createConnection(2877, "34.219.80.229", () => {
//nexus6p hs
// const client = net.createConnection(2877, "192.168.43.106", () => { 

//devleague 5g
const client = net.createConnection(2877, "10.0.1.148", () => {
  client.on("data", data => {
    console.log(data.toString());
  });
  process.stdin.pipe(client);
});