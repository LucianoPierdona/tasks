import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from '@hapi/joi';

export type EnvConfig = Record<string, string | boolean | number>;

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    let config = {};
    if (fs.existsSync(filePath)) {
      config = dotenv.parse(fs.readFileSync(filePath));
    }
    this.envConfig = this.validateInput({ ...config, ...process.env });
  }

  getString(key: string): string {
    return this.envConfig[key] as string;
  }

  getNumber(key: string): number {
    return this.envConfig[key] as number;
  }

  getBoolean(key: string): boolean {
    return this.envConfig[key] as boolean;
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const schema: any = {
      NODE_ENV: Joi.string().valid('development').default('development'),
      DB_CONNECTION_NAME: Joi.string().required(),
      DB_CONNECTION_DROP_SCHEMA: Joi.boolean().required(),
      DB_CONNECTION_SYNCHRONIZE: Joi.boolean().required(),
      DB_CONNECTION_LOGGING: Joi.boolean().required(),
      DB_CONNECTION_CACHE: Joi.boolean().required(),
      DB_CONNECTION_HOST: Joi.string().required(),
      DB_CONNECTION_PORT: Joi.number().required(),
      DB_CONNECTION_USERNAME: Joi.string().required(),
      DB_CONNECTION_PASSWORD: Joi.string().required(),
      DB_CONNECTION_DATABASE: Joi.string().required(),
    };

    const envVarsSchema: Joi.ObjectSchema = Joi.object(schema);
    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
      {
        allowUnknown: true,
        stripUnknown: true,
      },
    );

    // Don't test in test env
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return validatedEnvConfig;
  }
}
