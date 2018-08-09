const net = require("net");

clientArr = [];

const maxHP = 100;
const pistolDMG = 2;
const rifleDMG = 3;
const dualPistolDMG = 4;
const grenadeDMG = 20;
const halo1pistol = 100;

let weapon = "no weapon";
let shield = false;
let cover = false;
let covers = 6;
let grenades = 3;
let leftOverDamage = 0;
let shielded = 100;
let playersArr = [];
let turn = true;
let time = 2000;

let clientStatsWrite = () => {
  if (!client.name) {
    client.write("NONAME");
    client.write(`
HP:` + client.hp);
    client.write(`
WeaponDmg:` + client.weaponDMG);
    client.write(`
Shields:` + client.shielded);
    client.write(`
Grenades:` + client.grenades);
  } else {
    client.write(`
Name: ` + JSON.stringify(client.name).slice(1, (JSON.stringify(client.name).length - 3)));
    client.write(`
HP:` + client.hp);
    client.write(`
WeaponDmg:` + client.weaponDMG);
    client.write(`
Shields:` + client.shielded);
    client.write(`
Grenades:` + client.grenades);
  }
}

let socketShotWrite = () => {
  socket.write(`
You was shot at foo`);
  socket.write(`
`)
  socket.write(`
HP:` + socket.hp);
  socket.write(`
Shields:` + socket.shielded);
  socket.write(`
HP Buffer:` + socket.buffer);
};

let socketGrenadeWrite = () => {
  socket.write(`
You was grenaded at foo`);
  socket.write(`
`)
  socket.write(`
HP:` + socket.hp);
  client.write(`
Grenades:` + client.grenades);
  socket.write(`
Shields:` + socket.shielded);
  socket.write(`
HP Buffer:` + socket.buffer);
};

let clientSomeGrenadeWrite = () => {
  client.write(`
You received the full backlash from the grenade`);
  socket.write(`
`)
  client.write(`
HP:` + client.hp);
  client.write(`
Grenades:` + client.grenades);
  client.write(`
Shields:` + client.shielded);
  client.write(`
HP Buffer:` + client.buffer);
}

let clientFullGrenadeWrite = () => {
  client.write(`
You received the full backlash from the grenade`);
  socket.write(`
`)
  client.write(`
HP:` + client.hp);
  client.write(`
Grenades:` + client.grenades);
  client.write(`
Shields:` + client.shielded);
  client.write(`
HP Buffer:` + client.buffer);
}



const server = net.createServer(client => {
  console.log("CLIENT CONNECTED!");

  // var obj = client;

  client.write(`
Welcome to the sharpshooter arena.
Please set up your username.
To set up a username, type /name, space, and then the username you want.
Please type /help if you need any help on commands.`);


  client.on("data", data => {
    client.hp = maxHP;
    client.weapon = weapon;
    client.shield = shield;
    client.cover = cover;
    client.grenades = grenades;
    client.turn = turn;

    const chat = data.toString();

    if (chat.includes("/name")) {
      client.name = (chat.split(" "))[1];
      client.write(`
Now choose a weapon, you only have 2 hands :)
You will type "/" then the choice of gun you want
WARNING: IF YOU WANT TO DUAL WIELD, WRITE /pistolpistol OR /pistolshield.
  Pistol: 2 damage, attribute: no pierce, able to be paired with another pistol or shield
  Rifle: 2 damage, attribute: pierce, buff: extra 100hp, two hands
  Shield: no damage, attribute: buff-canceler, buff: 100 shield
  Everyone comes equipped with a 3 grenades. They bypass cover but you take half the damage of the impact.
  Grenade: 10 damage, attribute: bypass cover.
      `)
    } else if (chat.includes("/rifle")) {
      client.write("You are now equipped with a rifle, you aint dual equipped");
      client.weapon = "rifle";
      client.weaponDMG = rifleDMG;
      client.pierce = true;
      client.buffer = 100;
      client.shielded = 0;
      playersArr.push(client.name);

    } else if (chat.includes("/pistolshield")) {
      client.write("You are now equipped with a pistol and shield");
      client.weaponDMG = pistolDMG;
      client.pierce = false;
      client.shield = false;
      client.shielded = shielded;
      client.buffer = 0;
      playersArr.push(client.name);

    } else if (chat.includes("/pistolpistol")) {
      client.write("You are now dual wielding pistols, what a badass")
      client.weapon = "dualPistols";
      client.weaponDMG = dualPistolDMG;
      client.pierce = false;
      client.shielded = 0;
      client.buffer = 0;
      playersArr.push(client.name);

    } else if (chat.includes("/onlypistol") || chat.includes("/halo1pistol") || chat.includes("/justpistol")) {
      client.write("You are now equipped with a halo 1 pistol");
      client.weapon = "halo1_pistol";
      client.weaponDMG = halo1pistol;
      client.pierce = false;
      client.shielded = 0;
      client.buffer = 0;
      playersArr.push(client.name);

    } else if (chat.includes("/sniper")) {
      client.write("You are now equipped with a sniper rifle, use /headshot instead of /shoot to one shot people");
      client.weapon = "halo1_pistol";
      client.weaponDMG = 500;
      client.pierce = true;
      client.shield = true;
      client.shielded = 0;
      client.buffer = 0;
      playersArr.push(client.name);

    } else if (chat.includes("/help")) {
      client.write(`
You can type /shoot and the name of the username (space inbetween) you want to shoot to shoot with your weapon.
You can also choose to take cover by typing /cover, there are a total of 6 covers that can block one shot.
   If you take cover, you do not take damage from guns but do take damage from grenades.
Everyone comes equipped with a 3 grenades. They bypass cover but you take half the damage of the impact.
    Grenade: 10 damage, attribute: bypass cover.
    If the person is not behind cover and you threw a grenade, you take the full damage of the impact.
    Type /grenades and the username(space inbetween) to use grenades on the user.
You can also type /current to see player names online
You can also type /stats to see your current stats`);

    } else if (chat.includes("/stats")) {
      clientStatsWrite();

    } else if (chat.includes("/current")) {
      client.write(`
      Players currently online:` +
        `
      ` +
        playersArr);

    } else if (chat.includes("/cover")) {
      if (covers > 0) {
        client.cover = true;
      } else {
        client.write("AINT NO MORE COVERS");
        client.cover = false;
      }


    } else if (chat.includes("/shoot")) {
      const splitAttackChat = (chat.split(" "))[1];
      const attackedName = splitAttackChat;

      if (client.turn === true) {
        clientArr.forEach(socket => {
          if (socket.name === attackedName) {
            turn = false;
            var timer = setInterval(
              function () {
                turn = true;
                clearInterval(timer);
              }, time
            )
            if (socket.cover === true) {
              socket.cover = false;
              covers = covers - 1;
              client.write(socket.name + " was under cover");
            } else if (socket.shield === true && client.weapon !== "rifle" && socket.shielded > 0) {
              if ((socket.shielded = socket.shielded - client.weaponDMG) > 0) {

                socket.shielded = socket.shielded - client.weaponDMG
                socketShotWrite();

              } else if ((socket.shield = socket.shield - client.weaponDMG) < 0) {

                leftOverDamage = client.weaponDMG - socket.shield;
                socket.shielded = 0;
                socket.shield = false;
                socket.hp = socket.hp - leftOverDamage;
                socketShotWrite();

              } else if ((socket.shielded = socket.shielded - client.weaponDMG) === 0) {

                socket.shielded = 0;
                socket.shield = false;
                socketShotWrite();
              }
            } else if (socket.shield === true && client.weapon === "rifle" && socket.shielded > 0) {

              socket.hp = socket.hp - client.weaponDMG;
              socketShotWrite();

            } else if (socket.weapon === "rifle" && client.shield === true) {

              socket.hp = socket.hp - client.weaponDMG;
              socketShotWrite();

            } else if (socket.weapon === "rifle" && client.shield === false) {

              if ((socket.buffer = socket.buffer - client.weaponDMG) > 0) {

                socket.buffer = socket.buffer - client.weaponDMG
                socketShotWrite();

              } else if ((socket.buffer = socket.buffer - client.weaponDMG) < 0) {

                leftOverDamage = client.weaponDMG - socket.buffer;
                socket.buffer = 0;
                socket.hp = socket.hp - leftOverDamage;
                socketShotWrite();

              } else if ((socket.buffer = socket.shielded - client.weaponDMG) === 0) {

                socket.buffer = 0;
                socketShotWrite();
              }
            } else if ((socket.hp = socket.hp - client.weaponDMG) < 1) {

              client.write(socket.name + " has died");
              socket.write("YOU DED");

            } else {

              socket.hp = socket.hp - client.weaponDMG;
              socketShotWrite();
            }
          }
        })
      } else {

        client.write("CAN'T BE SPAMMING");

      }
    } else if (chat.includes("/headshot")) {
      const splitAttackChat = (chat.split(" "))[1]
      const attackedName = splitAttackChat;

      if (client.turn === true) {
        clientArr.forEach(socket => {

          turn = false;
          var timer = setInterval(
            function () {
              turn = true;
              clearInterval(timer);
            }, time
          )

          if (socket.name === attackedName) {
            socket.hp = 0;
            client.write(socket.name + " has died");
            socket.write("YOU DED");
          }
        });
      } else {
        client.write("CAN'T BE SPAMMING");
      }
    } else if (chat.includes("/grenade")) {
      const splitAttackChat = (chat.split(" "))[1];
      const attackedName = splitAttackChat;

      if (client.turn === true) {
        clientArr.forEach(socket => {
          if (socket.name === attackedName) {

            turn = false;
            var timer = setInterval(
              function () {
                turn = true;
                clearInterval(timer);
              }, time
            )

            if (socket.cover === true && socket.cover > 0) {
              socket.cover = false;
              covers = covers - 1;
              socket.hp = socket.hp - grenadeDMG;
              client.hp = client.hp - (grenadeDMG / 2);
              client.grenades = client.grenades - 1;

              socketGrenadeWrite();

              clientSomeGrenadeWrite();

            } else {
              socket.hp = socket.hp - grenadeDMG;
              client.hp = client.hp - grenadeDMG;
              client.grenades = client.grenades - 1

              socketGrenadeWrite();

              clientFullGrenadeWrite();
            }
          }
        });
      } else {
        client.write("CAN'T BE SPAMMING");
      }
    } else {
      clientArr.forEach(socket => {
        if (client !== socket) {
          if (!client.name) {
            socket.write("NONAME: " + chat);
          } else {
            socket.write(JSON.stringify(client.name).slice(1, (JSON.stringify(client.name).length - 3)) + ": " + chat);
          }
        }
      })
    }

  });

  client.on("end", data => {
    console.log("client disconnected");
  });

  clientArr.push(client);

})

server.listen(2877, () => {
  console.log("Server listening on port 2877");
});


