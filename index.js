const TelegramApi = require('node-telegram-bot-api')
const token = '6424881475:AAFTBluShY3at_ZV85XtnqFv044Xn6yqOIg'
const {gameOptions,againOptions}=require('./options')
const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Загадаю цифру от 0 до 9, а ты отгадай`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}
const start = () => {
    bot.setMyCommands([
        {command: '/start', description: "Начальное приветствие"},
        {command: '/info', description: "Инфо о пользователе"},
        {command: '/game', description: "Игра угадай цифру"},
    ])

    bot.on("message", async msg => {
        const text = msg.text
        const chatId = msg.chat.id
        if (text === '/start') {
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/195/dca/195dcaa7-8bc4-3540-9d3e-571e39999423/2.webp")
            return bot.sendMessage(chatId, `Ты поппал в чат Орловой Марии)?`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, "Не понял тебя")
    })
    bot.on('callback_query', async msg => {
        console.log(msg)
        const data = msg.date
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return  bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return  bot.sendMessage(chatId, `Ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}
start()