import mongoose from 'mongoose';

mongoose.connect(`mongodb://${encodeURIComponent(<string>process.env.username?.replace(/"/g, ''))}:${encodeURIComponent(<string>process.env.password?.replace(/"/g, ''))}}@87.236.22.124:27017/burlang?authSource=admin`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as any).catch(error => { console.error(error) });

const MONGODB_URI: string = `${process.env.MONGODB_URI}` || 'mongodb://localhost:27017/rlhub';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as any).catch(error => { console.error(error) });

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!');
});