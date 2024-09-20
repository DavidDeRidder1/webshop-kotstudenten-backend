module.exports = {
  log: {
    level: 'silly',
    disabled: true,
  },
  cors: { 
    origins: ['http://localhost:5173'], 
    maxAge: 3 * 60 * 60, 
  },
  auth: {
    argon: {
      saltLength: 16,
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
    jwt: {
      secret: 'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
      expirationInterval: 60 * 60 * 1000, // ms (1 hour)
      issuer: 'localhost:9000',
      audience: 'localhost:5173',
    },
  },
};