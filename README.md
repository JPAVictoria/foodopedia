# Foodopedia CMS

Foodopedia CMS is a full-stack content management system designed to publish and manage food-related content like recipes, instructions, 
and media assets. Built with modern technologies and structured for scale, it supports admin-level content control and viewer interactivity.

## Features

Admin/Publisher:
- Secure JWT-based authentication with login, signup, and password change flows
- Create, update, soft-delete content with status options: Draft or Published
- Dynamic fields for instructions and ingredients
- View analytics and configure admin profile (change name, password)
- Auto-redirect and content page transformation after create/update

Viewer:
- JWT-based authentication with login, signup, and password flows
- Favorite published content for personal reference

## Tech Stack

Frontend: Next.js (App Router), Tailwind CSS, shadcn/ui  
Backend: Express.js  
Database: PostgreSQL via Prisma ORM  
Authentication: JWT (stored via cookies), bcrypt  
API Communication: Axios and TanStack Query  

## Project Structure

foodopedia/  
├── client/ (Next.js app)  
│   └── app/  
│       ├── contents/ (create/update content pages)  
│       └── configure/ (admin settings)  
├── server/ (Express API)  
│   ├── admin/auth.route.ts  
│   ├── viewer/auth.route.ts  
│   └── content.create.route.js  
├── prisma/schema.prisma  


## Development Notes

- Content creation defaults to Draft status
- Soft deletion is controlled with a `deleted: true` flag in the Content model (no enum-based deletion)
- Media files are uploaded to `/uploads` and linked via URLs stored in a `media` table
- Axios handles most form-level logic; TanStack Query is used for some mutations
