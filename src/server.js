// src/server.js
import app from './app.js';
import dotenv from 'dotenv';

dotenv.config( );

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✓ BHOOM Backend API running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ API Base URL: http://localhost:${PORT}/api/v1` );
});
