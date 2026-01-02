# Quick Start Guide - Codetoli Commerce

## Project Status: ✅ Ready for Deployment

Your e-commerce platform has been successfully migrated to Next.js with enhanced security.

## Getting Started

### 1. Install Dependencies (Already Done)
```bash
npm install
```

### 2. Environment Setup
The `.env.local` file is already configured with Supabase credentials.

### 3. Create a Test Account (Admin Only)
Use Supabase dashboard to:
1. Create a user in `auth.users` table
2. Create a store entry and link it to the user via `user_id`

### 4. Start Development Server
```bash
npm run dev
# Server runs on http://localhost:3000
```

### 5. Login
- Navigate to `http://localhost:3000/auth/login`
- Enter credentials for the account created in step 3
- You'll be automatically redirected to your store's admin dashboard

## Key Features

### Landing Page
- **URL:** `http://localhost:3000/`
- **Content:** "Codetoli Commerce" branding only
- **Contact:** Email and LinkedIn links for account requests

### Authentication
- **URL:** `http://localhost:3000/auth/login`
- **Only Login Available:** No self-signup (accounts created by admins)
- **Auto-Redirect:** After login, redirects to store admin dashboard

### Admin Dashboard (Protected)
- **URL:** `/{store-slug}/admin-profile/`
- **Access:** Only authenticated store owners
- **Features:**
  - My Store
  - Products Management
  - Categories
  - Discounts
  - Social Links
  - Collect Payments
  - Invoices
  - Design Store
  - Settings

## Security Features

✅ **Authentication Required:** All admin routes require valid auth token  
✅ **Store Ownership Verified:** Users can only access their own stores  
✅ **Automatic Redirects:** Unauthenticated users redirected to login  
✅ **Non-Owners Blocked:** Users accessing other stores redirected to home  

## Building for Production

```bash
npm run build
npm start
```

The build will create an optimized production version in the `.next` folder.

## File Structure

```
app/                    # Next.js App Router
├── page.tsx           # Landing page
├── layout.tsx         # Root layout
├── [slug]/            # Store routes
│   └── admin-profile/ # Protected admin dashboard
├── auth/login/        # Login page
├── api/               # Backend API routes
└── ...

lib/                   # Utilities
middleware.ts         # Route protection
public/              # Static assets
supabase/           # Database migrations
```

## Troubleshooting

### Port Already in Use
The dev server will automatically use the next available port. Check the output for the actual URL.

### Build Errors
Ensure `.env.local` is present with valid Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Login Not Working
1. Verify user exists in Supabase `auth.users` table
2. Verify store exists and has correct `user_id` relationship
3. Check browser console for error messages

## Admin Account Creation

To create a new store admin:

1. **In Supabase Dashboard:**
   - Go to Authentication → Users
   - Click "Add user" and create account with email/password

2. **Create Store:**
   - Go to SQL Editor
   - Create store record with the user's ID:
   ```sql
   INSERT INTO stores (name, slug, user_id) 
   VALUES ('Store Name', 'store-slug', 'user-uuid');
   ```

3. **User Login:**
   - User logs in at `/auth/login`
   - Auto-redirected to `/store-slug/admin-profile/my-store`

## Support

For issues or questions:
- Email: support@codetolittech.qzz.io
- LinkedIn: https://linkedin.com/company/codetoli-technology

---

**Happy Coding! 🚀**
