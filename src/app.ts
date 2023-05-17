import express from 'express';
import bodyParser from 'body-parser';
import { IUser, User } from './models/IUser';
import { IPayment, Payment } from './models/IPayment';
import { ObjectId } from 'mongodb';
import { bot } from './index';

const PORT = process.env.PORT;
const app = express();
app.use(bodyParser.json());

// Handle POST request to '/bot'
app.post(`/bot123`, (req, res) => {
    console.log(res)
    bot.handleUpdate(req.body, res);
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle GET request to '/success'
app.get('/success', async (req, res) => {
    // Extract the billId from the request URL
    let billId: string = res.req.url.replace('/payment/success?billId=', '');
    console.log(billId);
});

// Handle GET request to '/payment/success'
app.get('/payment/success', async (req, res) => {
    // Extract the billId from the request URL
    let billId: string = res.req.url.replace('/payment/success?billId=', '');
    console.log(billId);

    // Find the payment document using the billId
    let payment: IPayment | null = await Payment.findOne({
        _id: new ObjectId(billId)
    });

    // Find the user document using the payment's user_id
    let user: IUser | null = await User.findOne({
        id: payment?.user_id
    });

    if (user && payment) {
        // Send a sticker and a message to the user using the Telegram bot
        await bot.telegram.sendSticker(user?.id, 'CAACAgIAAxkBAAEIRdBkHZukHX1iJJVPMeQmZvfKXRgfDQACiRkAAkHrwEvwxgiNPD3Rai8E');
        await bot.telegram.sendMessage(user?.id, 'Спасибо за внесенный платеж!', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Назад',
                            callback_data: 'back'
                        }
                    ]
                ]
            }
        });

        // Update the user's 'supported' field by adding the payment amount
        await User.findOneAndUpdate(
            {
                id: user.id
            },
            {
                $set: {
                    supported: user.supported + payment.amount
                }
            }
        );
    }

    // Redirect the user to 'https://t.me/burlive_bot'
    res.redirect('https://t.me/burlive_bot');
});
