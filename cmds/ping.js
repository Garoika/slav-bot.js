const Discord = module.require("discord.js");


module.exports.run = async (client, message, args)  => {

    const msg = await message.channel.send("Pinging...")
    await msg.edit(`Pong! Пинг ${msg.createdTimestamp - message.createdTimestamp}мс`)
    
}
module.exports.help = {
    name: "ping" // название команды
}
