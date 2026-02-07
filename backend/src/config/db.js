// Database configuration
const mongoose = require('mongoose');
const { DB_URI } = require('./env');

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.warn('⚠️ MongoDB connection failed, using in-memory storage:', error.message);
        // Don't exit, just continue with in-memory storage for demo
        // In production, you'd want to handle this differently
    }
};

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err);
});

const isDbConnected = () => mongoose.connection.readyState === 1;

module.exports = connectDB;
module.exports.isDbConnected = isDbConnected;
