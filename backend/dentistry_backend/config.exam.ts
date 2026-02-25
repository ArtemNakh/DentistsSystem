
// config.ts
export default () => ({
  environment: process.env.ENVIRONMENT || 'dev',
  port: parseInt(process.env.PORT ?? '5000', 10),
 
});
