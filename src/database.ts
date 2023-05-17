import mongoose from 'mongoose';

// @ts-ignore
const username = encodeURIComponent('alexandr')
const password = encodeURIComponent(<string>process.env.password?.replace(/"/g, ''))

console.log(username)
console.log(password)

const connectionString = `mongodb://${username}:${password}}@87.236.22.124:27017/burlang?authSource=admin`;
const MONGODB_URI: string = `${process.env.MONGODB_URI}` || 'mongodb://localhost:27017/rlhub';

mongoose.connect(connectionString || MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB!');
    })
    .catch(error => {
        console.error(error);
    });
