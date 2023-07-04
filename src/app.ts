import express from 'express';
import bodyParser from 'body-parser';
import { IUser, User } from './models/IUser';
import { IPayment, Payment } from './models/IPayment';
import { ObjectId } from 'mongodb';
import { bot } from './index';
import cors from 'cors';
const morgan = require("morgan")
const PORT = process.env.PORT;


const app = express();
export const secretPath = `/telegraf/secret_path`;
app.use(bodyParser.json());


// Handle POST request to '/bot'
app.post(`/telegraf/secret_path`, (req, res) => {
    bot.handleUpdate(req.body, res);
});

console.log(process.env.mode?.replace(/"/g, ''))
console.log(process.env.mode?.replace(/"/g, '') === 'production')
console.log(typeof (process.env.mode?.replace(/"/g, '')))


app.get("/", (req, res) => res.send("Бот запущен!"))

app.use(morgan("dev"));
app.use(cors());
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const fetchData = async () => {
    const { default: fetch } = await import('node-fetch');

    const res = await fetch('http://localhost:4040/api/tunnels');
    const json = await res.json();
    console.log(json)
    //@ts-ignore
    const secureTunnel = json.tunnels[0].public_url
    console.log(secureTunnel)
    await bot.telegram.setWebhook(`${secureTunnel}${secretPath}`)
        .then(res => {
            console.log(res)
        })
};

async function set_webhook() {
    console.log(`${process.env.mode?.replace(/"/g, '')}`)
    if (`${process.env.mode?.replace(/"/g, '')}` === "production") {
        console.log(`${process.env.mode?.replace(/"/g, '')}`)
        console.log(`secret path: ${secretPath}`)
        await bot.telegram.setWebhook(`https://profori.pro/telegraf/secret_path`)
            .then((status) => {
                console.log(secretPath);
                console.log(status);
            }).catch(err => {
                console.log(err)
            })
    } else {
        await fetchData().catch((error: any) => {
            console.error('Error setting webhook:', error);
        });
    }
};

set_webhook()
