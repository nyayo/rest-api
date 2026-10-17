import dotenv from 'dotenv';

dotenv.config();

export const limiterOptions = {
  windowMs: +process.env.WINDOW_MS,
  max: +process.env.MAX_REQUESTS,
};

export const bulkImportLimiterOptions = {
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    errors: ['Too many bulk import requests. Try again later.'],
  },
};
