const net = require("net");

clientArr = [];

const maxHP = 100;
const pistolDMG = 2;
const rifleDMG = 3;
const dualPistolDMG = 4;
const grenadeDMG = 10;
const halo1pistol = 100;
const shielded = 100;
const time = 2000;

let cover = false;
let covers = 100;
let grenades = 3;
let leftOverDamage = 0;
let namesArr = [];


const server = net.createServer(client => {
  console.log("CLIENT CONNECTED!");

  let clientStatsWrite = (client) => {
    if (!client.name) {
      client.write(`
  NONAME`);
      client.write(`
  HP:` + client.hp);
      client.write(`
  WeaponDmg:` + client.weaponDMG);
      client.write(`
  Shields:` + client.shielded);
      client.write(`
  Grenades:` + client.grenades);
    } else if (client.weapon === "notRifle" || client.weapon === "rifle") {
      client.write(`
  Name:` + JSON.stringify(client.name).slice(1, (JSON.stringify(client.name).length - 3)));
      client.write(`
  HP:` + client.hp);
      client.write(`
  WeaponDmg:2`);
      client.write(`
  Crit:true`);
      client.write(`
  Shields:` + client.shielded);
      client.write(`
  HP Buffer:` + client.buffer);
      client.write(`
  Grenades:` + client.grenades);
    } else {
      client.write(`
  Name:` + JSON.stringify(client.name).slice(1, (JSON.stringify(client.name).length - 3)));
      client.write(`
  HP:` + client.hp);
      client.write(`
  WeaponDmg:` + client.weaponDMG);
      client.write(`
  Crit:false`);
      client.write(`
  Shields:` + client.shielded);
      client.write(`
  HP Buffer:` + client.buffer);
      client.write(`
  Grenades:` + client.grenades);
    }
  }

  let socketShotWrite = (socket, client) => {
    socket.write(`
  You was shot at foo`);
    socket.write(`
  HP:` + socket.hp);
    socket.write(`
  Shields:` + socket.shielded);
    socket.write(`
  HP Buffer:` + socket.buffer);

    client.write("You shot " + JSON.stringify(socket.name).slice(1, (JSON.stringify(socket.name).length - 3)) + " for " + client.weaponDMG + " damage");
  };


  let socketGrenadeWrite = (socket) => {
    socket.write(`
  You was grenaded at foo`);
    socket.write(`
  HP:` + socket.hp);
    socket.write(`
  Shields:` + socket.shielded);
    socket.write(`
  HP Buffer:` + socket.buffer);
  };

  // };

  let clientSomeGrenadeWrite = (client) => {
    client.write(`
  You received the full backlash from the grenade`);
    client.write(`
  HP:` + client.hp);
    client.write(`
  Grenades:` + client.grenades);
    client.write(`
  Shields:` + client.shielded);
    client.write(`
  HP Buffer:` + client.buffer);
  }

  let clientFullGrenadeWrite = (client) => {
    client.write(`
  You received the full backlash from the grenade`);
    client.write(`
  HP:` + client.hp);
    client.write(`
  Grenades:` + client.grenades);
    client.write(`
  Shields:` + client.shielded);
    client.write(`
  HP Buffer:` + client.buffer);
  }

  let newPlayerFunction = (socket) => {

    namesArr.splice(namesArr.indexOf(socket.name), 1);

    socket.hp = maxHP;
    socket.name = undefined;
    socket.weapon = false;
    socket.shield = false;
    socket.cover = cover;
    socket.grenades = grenades;
    socket.turn = false;
    socket.counter = 0;

    socket.write("Respawn timer of 5 seconds before you can create a new character again");
    var timer = setInterval(function () {
      socket.turn = true;
      clearInterval(timer);
      socket.write(`
Please set up your username.
To set up a username, type /name and the username you want.
Please type /help if you need any help on commands.`)
    }, 5000)


  }


  client.hp = maxHP;
  client.weapon = false;
  client.shield = false;
  client.cover = cover;
  client.grenades = grenades;
  client.turn = true;
  client.counter = 0;

  client.write(`
            .-._
           ///  |
          ///L_/_)
         ///// |||
        /FUQ)/| ||
       / /""  |_/
      / /
     / /
    (U)

Welcome to the sharpshooter arena.
Please set up your username.
To set up a username, type /name and the username you want.
Please type /help if you need any help on commands.`);


  client.on("data", data => {

    const chat = data.toString();
    if (client.turn === true) {
      client.counter = 0;
      if (chat.includes("/name")) {
        if (namesArr.length === 0) {
          client.name = ((chat.split(" "))[1]);
          namesArr.push(client.name);
          client.write(`
Now choose a weapon, you only have 2 hands :)
You will type "/" then the choice of gun you want
WARNING: IF YOU WANT TO DUAL WIELD, WRITE /pistolpistol OR /pistolshield.
  Pistol: 2 damage, attribute: no pierce, able to be paired with another pistol or shield
  Rifle: 3 damage, attribute: pierce, buff: extra 100hp, two hands
  Shield: no damage, attribute: buff-canceler, buff: 100 shield
Everyone comes equipped with a 3 grenades. They bypass cover but you take half the damage of the impact.
  Grenade: 10 damage, attribute: bypass cover.`)
        } else {
          let duplicateNameCheck = (namesArr.map(socket => {
            if (((chat.split(" "))[1]) === socket) {
              return socket = true;
            } else {
              return socket = false;
            }
          })).filter(socket => socket === true);

          if (duplicateNameCheck.length > 0) {
            client.write(`
That name has been taken already`);
            client.write(`
Please try another name by typing /name and your desired name again`)
          } else {
            client.name = ((chat.split(" "))[1]);
            namesArr.push(client.name);
            client.write(`
Now choose a weapon, you only have 2 hands :)
You will type "/" then the choice of gun you want
WARNING: IF YOU WANT TO DUAL WIELD, WRITE /pistolpistol OR /pistolshield.
WEAPONS:
  Pistol: 
    2 damage, no critical hits 
    attribute: not able to pierce shield
    one-hand, able to be paired with another pistol or shield
  Rifle: 
    2 damage, critical hit for double damage
    attribute: pierce shield on critical 
    buff: extra 100hp
    two hands
  Shield:
    no damage, but can be paired with pistol
    attribute: cancels rifle's extra hp buff 
    shield: 100 shield absorbption
Everyone comes equipped with a 3 grenades. They bypass cover but you take half the damage of the impact.
  Grenade: 10 damage, attribute: bypass cover.`)
          }
        }
      } else if (chat.includes("/rifle")) {
        client.write("You are now equipped with a rifle, you aint dual equipped");
        client.weapon = "rifle";
        client.weaponDMG = rifleDMG;
        client.pierce = true;
        client.buffer = 100;
        client.shield = false;
        client.shielded = 0;
        client.grenadeDMG = grenadeDMG;
      } else if (chat.includes("/pistolshield")) {
        client.write("You are now equipped with a pistol and shield");
        client.weapon = "pistolShield";
        client.weaponDMG = pistolDMG;
        client.pierce = false;
        client.shield = true;
        client.shielded = shielded;
        client.buffer = 0;
        client.grenadeDMG = grenadeDMG;
      } else if (chat.includes("/pistolpistol")) {
        client.write("You are now dual wielding pistols, what a badass")
        client.weapon = "dualPistols";
        client.weaponDMG = dualPistolDMG;
        client.pierce = false;
        client.shield = false;
        client.shielded = 0;
        client.buffer = 0;
        client.grenadeDMG = grenadeDMG;
      } else if (chat.includes("/onlypistol") || chat.includes("/halo1pistol") || chat.includes("/justpistol")) {
        client.write("You are now equipped with a halo 1 pistol");
        client.weapon = "halo1pistol";
        client.weaponDMG = halo1pistol;
        client.pierce = false;
        client.shielded = 0;
        client.buffer = 0;
        client.grenadeDMG = grenadeDMG;
      } else if (chat.includes("/sniper")) {
        client.write("You are now equipped with a sniper rifle, use /headshot instead of /shoot to one shot people");
        client.weapon = "sniper";
        client.weaponDMG = 500;
        client.pierce = true;
        client.shield = true;
        client.shielded = 0;
        client.buffer = 0;
        client.grenadeDMG = grenadeDMG;
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
        clientStatsWrite(client);

      } else if (chat.includes("/current")) {
        let stringifyArr = (JSON.stringify(namesArr));
        let stringedNameArray = JSON.parse(stringifyArr).map(name => {
          return name.replace(/"/g, "").replace(/\n/g, "");
        })
        client.write(`
  Players currently online: ` +
          `
  ` + (stringedNameArray.sort()).join(", "));

      } else if (chat.includes("/cover")) {
        if (covers > 0) {
          client.cover = true;
        } else {
          client.write("AINT NO MORE COVERS");
          client.cover = false;
        }


      } else if (chat.includes("/shoot")) {

        let rifleCrit = (client) => {
          let pierceArr = [false, false, true];
          let dmgArr = [2, 2, 4];
          let weaponArr = ["notRifle", "notRifle", "rifle"]

          let randomNum = Math.floor(Math.random() * (pierceArr.length));

          let randomPierceArr = pierceArr[randomNum];
          let randomDmgArr = dmgArr[randomNum];
          let randomWeapon = weaponArr[randomNum];

          client.weapon = randomWeapon;
          client.pierce = randomPierceArr;
          client.weaponDMG = randomDmgArr;
        }

        const splitAttackChat = (chat.split(" "))[1];
        const attackedName = splitAttackChat;

        if (client.turn === true) {
          clientArr.forEach(socket => {
            if (socket.weapon === false) {
              client.write("Let the player choose a weapon first before you shoot");
            } else {
              if (socket.name === attackedName) {
                client.turn = false;
                var timer = setInterval(function () {
                  client.turn = true;
                  clearInterval(timer);
                }, time)
                client.cover = false;
                rifleCrit(client);
                if (socket.cover === true) {
                  socket.cover = false;
                  covers = covers - 1;
                  client.write(JSON.stringify(socket.name).slice(1, (JSON.stringify(socket.name).length - 3)) + " was under cover");
                  socket.write("You are no longer under cover");
                } else if (socket.shield === true && client.weapon !== "rifle") {

                  if ((socket.shielded - client.weaponDMG) > socket.shielded) {
                    leftOverDamage = (client.weaponDMG - socket.shield);
                    socket.shielded = 0;
                    socket.shield = false;
                    socket.hp = (socket.hp - leftOverDamage);
                    socketShotWrite(socket, client);
                  } else if ((socket.shielded - client.weaponDMG) === socket.shielded) {
                    socket.shielded = 0;
                    socket.shield = false;
                    socketShotWrite(socket, client);
                  } else {
                    socket.shielded -= client.weaponDMG;
                    socketShotWrite(socket, client);
                  }
                } else if (socket.shield === true && client.weapon === "rifle" && socket.shielded > 0) {
                  socket.hp = (socket.hp - client.weaponDMG);
                  socketShotWrite(socket, client);
                } else if (socket.weapon === "rifle" && client.shield === true) {
                  socket.hp = (socket.hp - client.weaponDMG);
                  socketShotWrite(socket, client);
                } else if (socket.weapon === "rifle" && client.shield === false) {
                  if ((socket.buffer - client.weaponDMG) > socket.buffer) {
                    leftOverDamage = (client.weaponDMG - socket.buffer);
                    socket.buffer = 0;
                    socket.hp = (socket.hp - leftOverDamage);
                    socketShotWrite(socket, client);

                  } else if ((socket.buffer - client.weaponDMG) === socket.buffer) {
                    socket.buffer = 0;
                    socketShotWrite(socket, client);
                  } else {
                    socket.buffer -= client.weaponDMG;
                    socketShotWrite(socket, client);
                  }
                } else if ((socket.hp - client.weaponDMG) > socket.hp) {
                  client.write(JSON.stringify(socket.name).slice(1, (JSON.stringify(socket.name).length - 3)) + " has died");
                  socket.write("YOU DED");
                  socket.hp = 0;
                  newPlayerFunction(socket);
                } else {
                  socket.hp -= client.weaponDMG;
                  socketShotWrite(socket, client);
                }
              }
            }
          })
        } else {
          counter++;
          if (counter >= 10) {
            client.write("STOP HACKING YO?");
            client.destroy();
          } else if (!client.name) {
            client.write("Please wait the full 5 seconds");
          } else {
            client.write("CAN'T BE SPAMMING");
          }
        }
      } else if (chat.includes("/headshot")) {
        const splitAttackChat = (chat.split(" "))[1]
        const attackedName = splitAttackChat;

        if (client.turn === true && client.weapon === "sniper") {
          clientArr.forEach(socket => {
            client.cover = false;
            client.turn = false;
            var timer = setInterval(
              function () {
                client.turn = true;
                clearInterval(timer);
              }, time
            )

            if (socket.name === attackedName) {
              if (socket.cover === true) {
                socket.cover = false;
                covers = covers - 1;
                client.write(socket.name + " was under cover");
              } else {
                socket.hp = 0;
                client.write(JSON.stringify(socket.name).slice(1, (JSON.stringify(socket.name).length - 3)) + " has died");
                socket.write("YOU DED");
                newPlayerFunction(socket);
              }
            }
          });
        } else {
          if (client.weapon !== "sniper") {
            client.write("YOU CANT BE HEADSHOTTING");
          } else {
            client.counter += 1;
            if (client.counter >= 10) {
              client.destroy();
            } else if (!client.name) {
              client.write("Please wait the full 5 seconds");
            } else {
              client.write("CAN'T BE SPAMMING");
            }
          }
        }
      } else if (chat.includes("/grenade")) {
        const splitAttackChat = (chat.split(" "))[1];
        const attackedName = splitAttackChat;

        if (client.turn === true) {
          clientArr.forEach(socket => {
            if (client.grenades > 0) {
              if (socket.name === attackedName) {
                client.cover = false;
                client.turn = false;
                var timer = setInterval(
                  function () {
                    client.turn = true;
                    clearInterval(timer);
                  }, time
                )
                if (socket.cover === true && covers > 0) {
                  if (((socket.hp - client.grenadeDMG) > socket.hp) && ((client.hp - client.grenadeDMG) > socket.hp)) {
                    socket.cover = false;
                    covers = covers - 1;
                    socket.hp = 0;
                    client.hp = 0;
                    client.grenades = (client.grenades - 1);

                    socket.write("YOU DED");
                    socket.write(JSON.stringify(client.name).slice(1, (JSON.stringify(client.name).length - 3)) + " has died");
                    client.write(JSON.stringify(socket.name).slice(1, (JSON.stringify(socket.name).length - 3)) + " has died");
                    client.write("YOU KILLED YOURSELF WITH A GRENADE LOL");
                    newPlayerFunction(socket);
                    newPlayerFunction(client);
                  } else if ((socket.hp - client.grenadeDMG) > socket.hp) {
                    socket.cover = false;
                    covers = covers - 1;
                    socket.hp = 0;
                    client.hp -= (client.grenadeDMG / 2);
                    client.grenades = (client.grenades - 1);

                    newPlayerFunction(socket);
                    socketGrenadeWrite("YOU DED");
                    client.write(JSON.stringify(socket.name).slice(1, (JSON.stringify(socket.name).length - 3)) + " has died");
                    clientSomeGrenadeWrite(client);
                  } else if ((client.hp - (client.grenadeDMG / 2)) > client.hp) {
                    socket.cover = false;
                    covers = covers - 1;
                    socket.hp -= client.grenadeDMG;
                    client.hp = 0;
                    client.grenades = (client.grenades - 1);

                    socketGrenadeWrite(socket);
                    socket.write(JSON.stringify(client.name).slice(1, (JSON.stringify(client.name).length - 3)) + " has died");
                    client.write("YOU KILLED YOURSELF WITH A GRENADE LOL");
                    newPlayerFunction(client);
                  } else {
                    socket.cover = false;
                    covers = covers - 1;
                    socket.hp -= client.grenadeDMG;
                    client.hp -= (client.grenadeDMG / 2);
                    client.grenades = (client.grenades - 1);

                    socketGrenadeWrite(socket);

                    clientSomeGrenadeWrite(client);
                  }

                } else {
                  if (((socket.hp - client.grenadeDMG) > socket.hp) && ((client.hp - client.grenadeDMG) > client.hp)) {
                    socket.hp = 0;
                    client.hp = 0;
                    client.grenades = (client.grenades - 1);

                    socket.write("YOU DED");
                    socket.write(JSON.stringify(client.name).slice(1, (JSON.stringify(client.name).length - 3)) + " has died");
                    client.write(JSON.stringify(socket.name).slice(1, (JSON.stringify(socket.name).length - 3)) + " has died");
                    client.write("YOU KILLED YOURSELF WITH A GRENADE LOL");
                    newPlayerFunction(socket);
                    newPlayerFunction(client);
                  } else if ((socket.hp - client.grenadeDMG) > socket.hp) {
                    socket.hp = 0;
                    client.hp -= client.grenadeDMG;
                    client.grenades = (client.grenades - 1);

                    socket.Write("YOU DED");
                    client.write(JSON.stringify(socket.name).slice(1, (JSON.stringify(socket.name).length - 3)) + " has died");
                    newPlayerFunction(socket);

                    clientSomeGrenadeWrite(client);
                  } else if ((client.hp - client.grenadeDMG) > client.hp) {
                    socket.hp -= client.grenadeDMG;
                    client.hp = 0;
                    client.grenades = (client.grenades - 1);

                    socketGrenadeWrite(socket);
                    socket.write(JSON.stringify(client.name).slice(1, (JSON.stringify(client.name).length - 3)) + " has died");
                    client.write("YOU KILLED YOURSELF WITH A GRENADE LOL");
                    newPlayerFunction(client);
                  } else {
                    socket.hp -= client.grenadeDMG;
                    client.hp -= client.grenadeDMG;
                    client.grenades = (client.grenades - 1)

                    socketGrenadeWrite(socket);

                    clientFullGrenadeWrite(client);
                  }
                }
              }
            } else {
              client.write("YOU OUT OF GRENADES");
            };
          })
        } else {
          client.counter += 1;
          if (client.counter >= 10) {
            client.destroy();
          } else if (!client.name) {
            client.write("Please wait the full 5 seconds");
          } else {
            client.write("CAN'T BE SPAMMING");
          }
        }
      } else {
        clientArr.forEach(socket => {
          if (client !== socket) {
            if (chat.includes("/")) {
              console.log(chat);
            } else {
              if (!client.name) {
                socket.write("NONAME: " + chat);
              } else {
                socket.write(JSON.stringify(client.name).slice(1, (JSON.stringify(client.name).length - 3)) + ": " + chat);
              }
            }
          }
        })
      }
    } else {
      client.counter += 1;
      if (client.counter >= 10) {
        client.destroy();
      } else if (!client.name) {
        client.write("Please wait the full 5 seconds");
      } else {
        client.write("CAN'T BE SPAMMING");
      }

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


