import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {
  const url = req.nextUrl;  
  const token = req.cookies.get('jwt');  

  const publicRoutes = ['/admin/register', '/admin/login', '/admin/forgot-password'];

  if (publicRoutes.includes(url.pathname)) {
    return NextResponse.next(); 
  }

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  try {
    const secretKey = process.env.JWT_SECRET;  
    if (!secretKey) {
      throw new Error("JWT_SECRET is not set in the environment variables.");
    }

    jwt.verify(token, secretKey); 

    return NextResponse.next(); 
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
}
