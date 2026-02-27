import morgan from 'morgan';

export const requestLogger = morgan('[:date[clf]] :method :url :status :res[content-length] - :response-time ms');
