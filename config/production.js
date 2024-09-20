module.exports = {
  log: {
    level: 'info',
    disabled: false,
  },
  cors: { 
    origins: ['https://two324-frontendweb-davidderidder7.onrender.com'], 
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
      issuer: 'budget.hogent.be',
      audience: 'budget.hogent.be',
    },
  },
  
};