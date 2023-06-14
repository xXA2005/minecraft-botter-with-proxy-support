const mineflayer = require('mineflayer')
const pvp = require('mineflayer-pvp').plugin
const { pathfinder, Movements, goals} = require('mineflayer-pathfinder')
const armorManager = require('mineflayer-armor-manager')
// const { mapDownloader } = require('mineflayer-item-map-downloader')
const proxyAgent = require("proxy-agent")  
const { connect } = require('http2')       
const socks = require("socks").SocksClient
const colors = require("gradient-string")
const figlet = require("figlet")
const inquirer = require("inquirer")

const BannerColor = colors(['#7289da', '#7F00FF'])
const StartColor = colors(['#00FFFF', '#4B0082'])
const DoneJoin = colors(['#00FA9A', '#008000'])
const ErrorColor = colors(['#FF0000', '#990000'])

async function Banner(){
  setTimeout(() => {

      console.clear()
      console.log(StartColor('welcome bbg'))        

      setTimeout(() => {
          console.clear()


          setTimeout(() => {
              
              console.log(BannerColor(figlet.textSync('Ab5 botter', {
                  font: 'bloody',
              })))
              console.log(StartColor('made by Ab.5#9111') )


              setTimeout(() => {
                  
                      const Info = inquirer.prompt([

                      {
                          name: 'name',
                          type: 'input',
                          message: StartColor('enter bot username:'),
                          default: 'NotBot'
                      },

                      {
                          name: 'ip',
                          type: 'input',
                          message: StartColor('enter Server ip:'),
                          default: '127.0.0.1'
                      },

                      {
                          name: 'count',
                          type: 'number',
                          message: StartColor('how much bots you want to join:'),
                          default: '10'
                      },
                      
                      {
                          name: 'port',
                          type: 'number',
                          message: StartColor('enter server port:'),
                          default: '25565'
                      },

                      {
                        name: 'delay in ms',
                        type: 'number',
                        message: StartColor('enter delay bitween bots:'),
                        default: '6000'
                    },

                  ]).then(tasks => {
                    sendBots(tasks.ip, tasks.port, tasks.name, tasks.count)
                  })


              }, 500)


          }, 1000)

      }, 500)

  }, 500)

}

Banner()



function sendBots (ip,port,name,count) {
  for (let i = 0;i<count; i++) {
    setTimeout(function() {
      new MCBot(`${name}_${i}`,ip,port)
    }, 6000 * i)
  }
} 




class MCBot {
    constructor(username,host,port) {
        this.username = username
        this.host = host
        this.port = port

        this.initBot()
    }

    initBot() {
        this.guardPos = null
        this.bot = mineflayer.createBot({
            "username": this.username,
            "host": this.host,
            "port": this.port,
            // "mapDownloader-outputDir": `./maps/${this.username}.png`, // i was planning to do map captcha bypass with AI but lazy yk
            // "logErrors": true,
            // agent: new proxyAgent({ protocol: "socks5", host: "nope", port: 69, password: "nope", username: "nope"}),
            //     connect: (client) => {
            //         socks.createConnection({
            //             proxy: {
            //                 host: "my rotating proxy lol",
            //                 port: 69,
            //                 type: 5,
            //                 userId: "py proxy username lol",
            //                 password: "my proxy password lol"
            //             },
            //             command: 'connect',
            //             destination: {
            //                 host: this.host,
            //                 port: this.port
            //             }
            //         },(err, info) =>{
            //             if (err) {
            //                 console.log(err)
            //                 return
            //             }
            //             client.setSocket(info.socket)
            //             client.emit('connect')
            //         }
            //         )
            //     }
        })
        this.bot.loadPlugin(pvp)
        this.bot.loadPlugin(armorManager)
        this.bot.loadPlugin(pathfinder)
        // this.bot.loadPlugin(mapDownloader)
        
        this.initEvents()
    }

    initEvents() {
        function guardArea (pos) {
        this.guardPos = pos.clone()

        if (!this.bot.pvp.target) {
            moveToGuardPos()
        }
        }

        function stopGuarding () {
        this.guardPos = null
        this.bot.pvp.stop()
        this.bot.pathfinder.setGoal(null)
        }

        function moveToGuardPos () {
        const mcData = require('minecraft-data')(this.bot.version)
        this.bot.pathfinder.setMovements(new Movements(this.bot, mcData))
        this.bot.pathfinder.setGoal(new goals.GoalBlock(this.guardPos.x, this.guardPos.y, this.guardPos.z))
        }

        
        this.bot.on('login', () => {
          console.log(DoneJoin(`[+] ${this.username} joined`))
            this.bot.chat("/register something")
            this.bot.chat("/register something something")
            setTimeout(() => this.bot.chat('/login something'), 5000)
            setTimeout(() => this.bot.chat('hi im alive'), 5000)


          
        })

        this.bot.on('end', (reason) => {
            console.log(ErrorColor(`[${this.username}] Disconnected: ${reason}`))
    
            if (reason == "disconnect.quitting") {
                return
            }
    
            // Attempt to reconnect
            setTimeout(() => this.initBot(), 5000)
        })


        this.bot.on('error', (err) => {
            if (err.code == 'ECONNREFUSED') {
                console.log(ErrorColor(`[${this.username}] Failed to connect to ${err.address}:${err.port}`))
            }
            else {
                console.log(ErrorColor(`[${this.username}] Unhandled error: ${err}`))
            }
        })

        this.bot.on('physicTick', () => {
            if (this.bot.pvp.target) return
            if (this.bot.pathfinder.isMoving()) return
          
            const entity = this.bot.nearestEntity()
            if (entity) this.bot.lookAt(entity.position.offset(0, entity.height, 0))
          })


        this.bot.on('spawn', () =>{
          setInterval(() => this.bot.chat('something lol'), 3000)
        })
        
        this.bot.on('chat', (username, message) => {
            // console.log(`${username} said: ${message}`)
          
            if (message === 'fight me') {
              const player = this.bot.players[username]
          
              if (!player) {
                this.bot.chat("where are you n1gg4")
                return
              }
          
              this.bot.chat('i luv ur mom')
              this.bot.pvp.attack(player.entity)
            }

            if (message === 'here'){
                const player = this.bot.players[username]

                if (!player) {
                    this.bot.chat("where")
                return
                }

                this.bot.chat('ok')
                guardArea(player.entity.position)
            }
          
          })

          this.bot.on('playerCollect', (collector, itemDrop) => {
            if (collector !== this.bot.entity) return
          
            setTimeout(() => {
              const sword = this.bot.inventory.items().find(item => item.name.includes('sword'))
              if (sword) this.bot.equip(sword, 'hand')
            }, 150)
          })
          
          this.bot.on('playerCollect', (collector, itemDrop) => {
            if (collector !== this.bot.entity) return
          
            setTimeout(() => {
              const shield = this.bot.inventory.items().find(item => item.name.includes('shield'))
              if (shield) this.bot.equip(shield, 'off-hand')
            }, 250)
          })
          
    
        }
}
