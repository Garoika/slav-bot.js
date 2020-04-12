const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");
client.commands = new Discord.Collection();
const config = require("./config.json");
const token = config.token;
const prefix = config.prefix;
const Enmap = require("enmap")


///////////база данных
client.balance = new Enmap({
  name: "balance",
  autoFetch: true,
  fetchAll: true
})

client.profile = new Enmap({
  name: "profile",
  autoFetch: true,
  fetchAll: true
})


/////////////////

fs.readdir('./cmds/', (err, files) => {
  if(err) console.log(err);
  let jsfiles = files.filter(f => f.split(".").pop() === "js");
  if(jsfiles.length <= 0) console.log("Нет команд для загрузки!");
  console.log(`Загружено ${jsfiles.length} команд!`);
  jsfiles.forEach((f, i) => {
    let props = require(`./cmds/${f}`)
    console.log(`${i+1}.${f} запущен!`)
    client.commands.set(props.help.name,props);
  })
})


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', async message => {

  if(message.author.bot) return;
if(message.channel.type == "dm") return;
let uid = message.author.id;
client.send = function(msg) {
  message.channel.send(msg)
}

  
  
  if(!client.balance.get(message.author.id)) {
    client.balance.set(message.author.id, {
      coins: 0
    })
  }
  
  if(!client.profile.get(message.author.id)) {
    client.profile.set(message.author.id, {
      lvl: 1,
      xp: 0,
      needxp: 5
    })
  }
  
  client.profile.inc(message.author.id, "xp")
  if(client.profile.get(message.author.id).xp === client.profile.get(message.author.id).needxp)  {
    client.profile.inc(message.author.id, "lvl")
    client.profile.math(message.author.id, "-", client.profile.get(message.author.id).xp, "xp")
    client.profile.math(message.author.id, "+", 3, "needxp")
    message.channel.send(message.author.tag + " повысил свой уровень до " + client.profile.get(message.author.id).lvl)
  }

  

let messageArray = message.content.split(" ");
let command = messageArray[0].toLowerCase();
let args = messageArray.splice(1);

if(!message.content.startsWith(prefix)) return;
let cmd = client.commands.get(command.slice(prefix.length));
if(cmd) cmd.run(client,message,args);
client.rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
client.uId = message.author.id;
  });



client.login(token);
