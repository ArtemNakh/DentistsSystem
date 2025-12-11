// //осьновний конфіг
// const merge = require("lodash/merge")
// if (typeof document !== "undefined")
//   throw new Error("Don`t import config.ts from inside the cliemt-side code!!!");

// const isDev = process.env.ENVIRONMENT !== "prod" ? true : false;


// const prodConfig = {
//   dev: isDev,
//   environment: process.env.ENVIRONMENT,
//   baseUrl: process.env.baseUrl,
// };

// let localConfig = {};

// if (isDev) {
//   try {
//     localConfig = require("./config.local.ts");
//   } catch (ex) {
//     console.log("ex", ex);
//     console.log("config.local does not exist");
//   }
// }

// module.exports = merge(prodConfig, localConfig ?? {});



// config.ts
export default () => ({
  environment: process.env.ENVIRONMENT || 'dev',
  port: parseInt(process.env.PORT ?? '5000', 10),
  database: {
    host: process.env.MYSQL_HOST ?? 'localhost',
    user: process.env.MYSQL_USER ?? 'root',
    db: process.env.MYSQL_DB ?? 'DefaultNameDB',
    password: process.env.MYSQL_PASSWORD ?? '',
    port: parseInt(process.env.MYSQL_PORT ?? '3306', 10),
  },
});
