export default (): any => ({
  port: process.env.PORT || '80',
  mongoUrl: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017',
  apiKey: process.env.API_KEY || '825765d4-7f8d-4d83-bb03-9d45ac9c27c0',
});
