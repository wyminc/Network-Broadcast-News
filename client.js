const net = require("net");

//ec2
const client = net.createConnection(2877, "34.219.80.229", () => {
  //nexus6p hs
  // const client = net.createConnection(2877, "192.168.43.106", () => { 
  client.on("data", data => {
    console.log(data.toString());
  });
  process.stdin.pipe(client);
});