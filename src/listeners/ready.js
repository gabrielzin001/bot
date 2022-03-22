const { Message } = require('discord.js');

module.exports = async function onReady() {
  console.log(`Logado.`);
  const s = [
    { name: `🪧 Versão ${require('../../package.json').version}!`, type: 'STREAMING', url: 'https://twitch.tv/gymjs' },
    { name: '🏆 Anda perdido? Me mencione!', type: 'PLAYING' },
    { name: '🔑 Entre em contato para reportar qualquer bug.', type: 'PLAYING' },
    { name: '🎍 Desfrute de uma moderação a nível superior!', type: 'PLAYING' },
    { name: '👩‍🚀 Mais Comandos legais para Você!', type: 'PLAYING' },
    // { name: `Manutenção`, type: 'STREAMING', url: 'https://www.twitch.tv/cellbit' },
    // { name: `Manutenção`, type: 'STREAMING', url: 'https://www.twitch.tv/cellbit' },
    // { name: `Manutenção`, type: 'STREAMING', url: 'https://www.twitch.tv/cellbit' },
    // { name: `Manutenção`, type: 'STREAMING', url: 'https://www.twitch.tv/cellbit' }
  ];
  const stats = ['online', 'dnd', 'idle']
  setInterval(() => {
    const status = stats[Math.floor(Math.random() * stats.length)]
    const game = s[Math.floor(Math.random() * s.length)]
    this.user.setPresence({ activities: [game], status: status })
  }, 20 * 1000) // Add 20 seconds to avoid over-updating.

  // Essa funcao busca na Db usuarios mutados e tenta remover o cargo deles
  // se ja passou tempo de mute
  const muteCheck = async () => {
    const usuariosMutados = await this.database.mutado.model.find({}).lean()
    for (let user = 0; user < usuariosMutados.length; user++) {
      console.log(usuariosMutados.length > 0 ? usuariosMutados : [])
      this.database.mutado.getAndDelete(usuariosMutados[user]._id)
      if (Date.now() >= usuariosMutados[user].time) {
        const server = this.guilds.cache.get(usuariosMutados[user].server)
        const userId = usuariosMutados[user]._id
        const channel = this.channels.cache.get(usuariosMutados[user].channel)
        try {
          const role = server.roles.cache.find(r => r.name == 'Muted')
          if (!role) {
            message.reply('erro no cargo')
          }
          server.members.fetch()
          if (!server.members.cache.get(userId)?.roles?.cache?.get(role.id)) return
          server.members.cache.get(userId).roles.remove(role).then(() => {
            channel.send(`Usuário ${this.users.cache.get(userId)} desmutado. <:a_blurplesettings:856174395801075773>`)
            this.database.mutado.getAndDelete(userId)
            console.log(`Usuário ${this.users.cache.get(userId).tag} foi desmutado e removido da Db`)
          })
        }

        catch (err) {
          console.log(`Algo errado em tentar remover cargo de ${this.users.cache.get(userId)}, ${err}`)
          this.database.mutado.getAndDelete(userId)
        }

      }
    }
  }
  setInterval(() => muteCheck(), 30 * 1000)

  // =============================================================================

  // // Aqui posta os comandos
  // this.api.applications(this.user.id).commands.post({
  //     data: {
  //         name: 'ping',
  //         description: '[ 🌐 • Fun ] Mostra a latência da API.'
  //     }
  // })
  // this.api.applications(this.user.id).commands.post({
  //     data: {
  //         name: 'ajuda',
  //         description: '[ 📝 • Fun ] Exibe a lista de comandos da aplicação.'
  //     }
  // })

  // this.ws.on('INTERACTION_CREATE', async (interaction) => {
  //     // Faço os comandos aqui
  //     const command = interaction.data.name.toLowerCase()

  //     const args = interaction.data.options

  //     if (command === 'ping') {
  //         // Infelizmente tem que ter a bosta do if
  //         this.api.interactions(interaction.id, interaction.token).callback.post({
  //             data: {
  //                 type: 5
  //                 //data: {
  //                     // Caso queira um slash que so author possa ver deixe habilitado
  //                     //flags: 1 << 6
  //                 //}
  //             }
  //         })
  //         // Responde a menssagem com um inline reply
  //         return await new WebhookClient(this.user.id, interaction.token).send(`<:2690chart:832746523980201994> ⇝ Ping: ${this.ws.ping}ms`)
  //     }
  // })
  // // novo comando
  // this.ws.on('INTERACTION_CREATE', async (interaction, message) => {
  //     // Faço os comandos aqui
  //     const command = interaction.data.name.toLowerCase()

  //     const args = interaction.data.options

  //     if (command === 'ajuda') {
  //         // Infelizmente tem que ter a bosta do if
  //         this.api.interactions(interaction.id, interaction.token).callback.post({
  //             data: {
  //                 type: 5
  //                 //data: {
  //                     // Caso queira um slash que so author possa ver deixe habilitado
  //                     //flags: 1 << 6
  //                 //}
  //             }
  //         })
  //     // roda o comando
  //     return await new WebhookClient(this.user.id, interaction.token).send(`<:2754danger:832746524152168449> Atenção, todos os comandos foram devidamente testados e não poderão ser adicionadas cópias dos mesmos já existentes dentro do SlashCommands\n\nDesta forma, iremos manter o nome dos comandos originais, e renomea-los, assim vocês poderão usar o Slash Commands como uma forma simplificada deles, ou de sua grande maioria!`)

}