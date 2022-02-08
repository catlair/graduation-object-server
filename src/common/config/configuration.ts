// 这里的名字如果和环境变量的名字一致，则只会读取环境变量的值，所以改成了小写
const pInt = (key: keyof IndirectEnvType) => parseInt(process.env[key], 10);

const configuration = () => ({
  port: pInt('PORT') || 3000,
  email: {
    host: process.env.EMAIL_HOST,
    port: pInt('EMAIL_PORT') || 465,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: pInt('REDIS_PORT') || 6379,
  },
  cacheTTl: pInt('CACHE_TTL') || 300,
  saltRounds: pInt('SALT_ROUNDS') || 10,
  salt: process.env.SALT || 'tlas',
  rateLimitMax: pInt('RATE_LIMIT_MAX') || 20,
  graphql: {
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema.graphql',
    sortSchema: true,
  },
  security: {
    expiresIn: '15m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
});

// 使用 DirectEnvType 而不是 EnvType， 目的是不提示间接使用的环境变量
export type Configuration = ReturnType<typeof configuration> & DirectEnvType;

export default configuration;

export { configuration };
