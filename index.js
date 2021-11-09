const {
    token,
    prefix
} = require("./config.json");

const {
    Client,
    Intents,
    MessageEmbed
} = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});


const tf = require('@tensorflow/tfjs-node')
const faceapi = require('@vladmandic/face-api/dist/face-api.node.js');



const axios = require("axios");;


let model_path = "./node_modules/@vladmandic/face-api/model"
faceapi.nets.tinyFaceDetector.loadFromDisk(model_path),
    faceapi.nets.faceLandmark68Net.loadFromDisk(model_path),
    faceapi.nets.faceRecognitionNet.loadFromDisk(model_path),
    faceapi.nets.ageGenderNet.loadFromDisk(model_path)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


client.on("messageCreate", async message => {
    if (message.author.bot) return;
    if (message.content == `${prefix}find`) {
        if (message.attachments.size > 0) {
            message.attachments.forEach(async Attachment => {


                await message.channel.send("Calculating your age....")
                let link = Attachment.url
                if (!link.includes(".gif")) {

                    let fn = async () => {
                        let pic = await axios.get(link, {
                            responseType: 'arraybuffer',
                        });

                        setTimeout(async function() {


                            try {
                             

                                let image = await tf.node.decodeImage(pic.data, 3);

                                const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withAgeAndGender();
                                image.dispose()

                                let kek = detections[0].age;
                                let old = detections[0].age;
                                const exampleEmbed = new MessageEmbed()
                                    .setColor('#0099ff')
                                    .setTitle('Estimation')
                                    .setDescription(`Predicted gender: ${kek}
                                    Your age is:${ Math.round(old)}`)
                                    .setImage(Attachment.url)
                                await message.channel.send({
                                    embeds: [exampleEmbed]
                                });
                            } catch (e) {
                                await message.channel.send("error! Try sending different image of appropriate dimension")
                            }
                        }, 100);
                    }
                    fn()
                }
            })
        }
    }
});




client.login(token);