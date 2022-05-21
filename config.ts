export const config = {
    db: {
      type: 'postgres',
      host: 'batyr.db.elephantsql.com',
      port: 5432,
      database: 'lyqipzfk',
      username: 'lyqipzfk',
      password: '40RPOltA7YXLMFz3Rk1IelpG4vDIcU2f',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    },
    db2: {
      type: 'postgres',
      host: 'kesavan.db.elephantsql.com',
      port: 5432,
      database: 'oessxurc',
      username: 'oessxurc',
      password: 'f5EYlhZ8_tBCOYokqYZlkH9MsL0vl6Z_',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    },
    frontEndKeys: {
        url: 'localhost',
        port: 4200,
        endpoints: ['auth/reset-password', 'auth/verify-email'],
      },
      configuration:{
        PORT: 3000,
      }
  };
  