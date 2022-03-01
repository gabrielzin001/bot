const { Command, colors } = require('../../utils')
const { MessageEmbed } = require('discord.js')

module.exports = class RenameChannel extends Command {
  constructor(name, client) {
    super(name, client)

    this.name = 'renamechannel'
    this.aliases = ['RenameChannel', 'RenomearCanal', 'ChannelRename']
    this.category = 'Mod'
  }

  async run(message, args) {
    const embedA = new MessageEmbed()

      .setTimestamp()
      .setColor(colors.default)
      .setTitle('**Err:**', true)
      .setDescription('Missing Permissions') // inline false
      .addField('*Verifique se você possui a permissão:*', '`MANAGE_CHANNEL`', true)
      .setFooter('🧁・Discord da Jeth', message.guild.iconURL({ dynamic: true, size: 1024 }))
    if (!message.member.permissions.has('MANAGE_CHANNEL')) message.channel.send({ embeds: [embedA] })
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
    if (!channel) return message.channel.send('Mencione o canal que deseja trocar o nome')
    const name = args.slice(1).join('\u2006').replace('&', '＆').replace('|', '│')
    if (!name) return message.channel.send('Nenhum nome foi inserido')

    channel.setName(name).then(() => {
      message.channel.send(`Nome do canal ${channel} alterado com sucesso para ${name}!`)
    })
  }
}