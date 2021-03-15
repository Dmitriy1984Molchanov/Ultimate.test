export default (): any => ({
  port: process.env.PORT || 3000,
  apiKey: process.env.API_KEY || '825765d4-7f8d-4d83-bb03-9d45ac9c27c0',
  AIUrl: process.env.AI_URL || 'http://localhost:3001',
  confidenceThreshold: parseInt(process.env.CONFIDENCE_THRESHOLD, 10) || 0.5,
});
