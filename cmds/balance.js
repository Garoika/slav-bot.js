const Discord = module.require("discord.js");


module.exports.run = async (client, message, args)  => {

message.channel.send("Ваши коины: " + client.balance.get(message.author.id).coins)
    
}
module.exports.help = {
    name: "balance" // название команды
}
