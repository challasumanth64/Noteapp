import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// This declaration allows us to attach 'userId' to the Express Request object.
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication failed: No token provided or malformed header.' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed: Invalid token.' });
  }
};

export default auth;