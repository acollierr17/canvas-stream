const { contrast } = require('discord.js-canvas');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { Attachment } = require('discord.js');

exports.run = async (client, message, args) => {

  const image = message.mentions.users.first() ?
    message.mentions.users.first().displayAvatarURL
    : message.author.displayAvatarURL;

  try {
    const { body } = await request.get(image);
    const data = await loadImage(body);
    const canvas = createCanvas(data.width, data.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(data, 0, 0);
    contrast(ctx, 0, 0, data.width, data.height);

    const attachment = new Attachment(canvas.toBuffer(), 'contrast.png');
    message.channel.send(`Here you go, ${message.author}!`, attachment);
  } catch (error) {
    client.logger.error(error);
    return message.channel.send(`An error ocurred: **${error.message}**`);
  }
};

exports.help = {
  name: 'canvas',
  aliases: [],
  description: 'Use Konva to create images and add data to them.',
  usage: 'canvas'
};