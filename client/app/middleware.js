import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {
  const url = req.nextUrl;  // Use `nextUrl` to handle route paths properly
  const token = req.cookies.get('jwt');  // Get the JWT token from cookies

  // Public routes that do not require authentication
  const publicRoutes = ['/admin/register', '/admin/login', '/admin/forgot-password'];

  // If the current URL matches any public route, proceed without checking the token
  if (publicRoutes.includes(url.pathname)) {
    return NextResponse.next(); 
  }

  // If there's no token, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  try {
    const secretKey = process.env.JWT_SECRET;  // Get the JWT secret from the environment
    if (!secretKey) {
      throw new Error("JWT_SECRET is not set in the environment variables.");
    }

    // Verify the token using the JWT secret
    jwt.verify(token, secretKey); 

    // If verification passes, allow the request to continue
    return NextResponse.next(); 
  } catch (err) {
    // If the token is invalid or expired, redirect to the login page
    console.error("Token verification failed:", err.message);
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
}
