import mongoose from 'mongoose';

const connectionString = `mongodb://${encodeURIComponent(<string>process.env.username?.replace(/"/g, ''))}:${encodeURIComponent(<string>process.env.password?.replace(/"/g, ''))}}@87.236.22.124:27017/burlang?authSource=admin`;
const MONGODB_URI: string = `${process.env.MONGODB_URI}` || 'mongodb://localhost:27017/rlhub';

mongoose.connect(connectionString || MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB!');
    })
    .catch(error => {
        console.error(error);
    });
