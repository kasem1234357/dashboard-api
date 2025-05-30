const corsOptions = {
    origin: process.env.websiteUrl || 'http://localhost:3000', // Specify the allowed origin(s) here
    methods: 'GET,HEAD,OPTIONS,POST,PUT,DELETE',
    allowedHeaders: 'Origin, Content-Type, X-Requested-With, Accept, Authorization',
    exposedHeaders : ['X-Custom-Header'],
    credentials: true

  };
  module.exports = corsOptions