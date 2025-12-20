// // import { DataSource } from 'typeorm';
// // import * as dotenv from 'dotenv';



// // dotenv.config(); // 👈 завантажує .env
// // const AppDataSource = new DataSource({
// //   type: 'mysql',
// //   host: process.env.MYSQL_HOST || 'localhost',
// //   port: Number(process.env.MYSQL_PORT) || 3306,
// //   username: process.env.MYSQL_USER || 'root',
// //   password: process.env.MYSQL_PASSWORD || '',
// //   database: process.env.MYSQL_DB || 'test',
// //   entities: ['src/**/*.entity{.ts,.js}'],
// //   migrations: ['migrations/*{.ts,.js}'],

  
  

// //   synchronize: false,
// //   migrationsRun: false,
// // });

// // export default AppDataSource;
// import { DataSource } from 'typeorm';
// import * as dotenv from 'dotenv';

// dotenv.config(); // завантажує .env

// const AppDataSource = new DataSource({
//   type: 'mysql',
//   host: process.env.MYSQL_HOST || 'localhost',
//   port: Number(process.env.MYSQL_PORT) || 3306,
//   username: process.env.MYSQL_USER || 'root',
//   password: process.env.MYSQL_PASSWORD || '',
//   database: process.env.MYSQL_DB || 'test',

//   // Використовуємо __dirname, щоб правильно працювало і в src, і в dist
//   entities: [__dirname + '/../**/*.entity{.js,.ts}'],
//   migrations: [__dirname + '/../migrations/*{.js,.ts}'],

//   synchronize: false,   // ніколи не вмикай у проді
//   migrationsRun: false, // міграції запускай вручну через CLI
// });

// export default AppDataSource;
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config(); // завантажує .env

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT) || 3306,
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DB || 'test',

  // Використовуємо __dirname, щоб правильно працювало і в src, і в dist
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../../migrations/*.{js,ts}'],

  synchronize: false,   // не використовуй у проді
  migrationsRun: false, // міграції запускай вручну через CLI
});


export default AppDataSource;
