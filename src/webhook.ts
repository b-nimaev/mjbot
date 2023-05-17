import { bot } from ".";

const fetchData = async () => {
    const { default: fetch } = await import('node-fetch');

    const res = await fetch('http://localhost:4040/api/tunnels');
    const json = await res.json();
    console.log(json)
    //@ts-ignore
    const secureTunnel = json.tunnels[0].public_url
    console.log(secureTunnel)
    await bot.telegram.setWebhook(`${secureTunnel}/bot123`)
        .then(res => {
            console.log(res)
        })
};

async function set_webhook () {
    if (process.env.mode === 'production') {
        bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/bot123`).then(() => {
            console.log('webhook setted');
        });
    } else {
        await fetchData().catch((error: any) => {
            console.error('Error setting webhook:', error);
        });
    }
};

set_webhook()
