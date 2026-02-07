require('dotenv').config();

module.exports = {
    PORT: parseInt(process.env.PORT || '3000', 10),
    DB_URI: process.env.DB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/identix',
};
