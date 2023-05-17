import { bot } from ".";
import { secretPath } from "./app";

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

async function set_webhook () {
    console.log(`${process.env.mode?.replace(/"/g, '')}`)
    if (`${process.env.mode?.replace(/"/g, '')}` === "production") {
        console.log(`${process.env.mode?.replace(/"/g, '')}`)
        console.log(`secret path: ${secretPath}`)
        await bot.telegram.setWebhook(`https://profori.pro${secretPath}`).then((status) => {
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
