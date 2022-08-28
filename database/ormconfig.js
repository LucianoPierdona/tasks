const path = require('path'); // eslint-disable-line
const envConfig = require('dotenv').config({
  path: `${
    process.env.NODE_ENV
      ? path.resolve(__dirname, `../${process.env.NODE_ENV}.env`)
      : path.resolve(__dirname, '../development.env')
  }`,
});
if (envConfig.error) {
  throw envConfig.error;
}

function env(key) {
  return envConfig[key] || process.env[key];
}

const baseConfig = {
  type: 'postgres',
  database: env('DB_CONNECTION_DATABASE'),
  entities: [path.join(__dirname, '../src/**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '../database/migrations/**/*.ts')],
  logger: 'advanced-console',
  logging: ['warn', 'error'],
  cli: {
    migrationsDir: path.join('database', 'migrations'),
  },
  seeds: ['database/seeds/**/*{.ts,.js}'],
  factories: ['database/factories/**/*{.ts,.js}'],
};

module.exports = {
  host: env('DB_CONNECTION_HOST'),
  port: env('DB_CONNECTION_PORT'),
  username: env('DB_CONNECTION_USERNAME'),
  password: env('DB_CONNECTION_PASSWORD'),
  synchronize: false,
  ...baseConfig,
};
