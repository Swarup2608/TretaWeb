# Treta Web - Secure CMS Dashboard

A modern, secure Content Management System (CMS) dashboard built with Next.js 13+, TypeScript, and React. This system includes enterprise-grade security measures and comprehensive protection against common attack vectors.

---

## Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Security Implementation](#-security-implementation)
- [Testing](#-testing)
- [User Management](#-user-management)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### Content Management
- **11 Editable Sections**: Hero, About, Services, Numbers, Values, Case Studies, FAQ, Footer, Header, CTA, Meta
- **Real-time Updates**: Changes apply instantly across the website
- **Easy Interface**: Intuitive dashboard for managing all content
- **Image Uploads**: Upload images directly through the dashboard (JPEG, PNG, WebP, GIF - max 5MB)
- **Meta Settings**: Manage global theme colors, fonts, and SEO settings

### Security Features
- **JWT Authentication**: Secure token-based authentication with 24-hour expiration
- **Password Hashing**: bcryptjs with 10-salt rounds for maximum security
- **Role-Based Access**: Admin and superadmin roles with proper authorization
- **Rate Limiting**: 5 login attempts per 15 minutes per IP address
- **Directory Traversal Prevention**: Path validation on all file operations
- **HttpOnly Cookies**: Secure token storage not accessible to JavaScript
- **HTTPS Ready**: Secure flag enabled in production
- **Input Validation**: All inputs validated and sanitized
- **File Upload Validation**: Type checking, size limits, filename sanitization
- **CSRF Protection**: SameSite cookie policy
- **Password Reset System**: Token-based password reset with 6-hour expiration

### Technology Stack
- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with CSS variables
- **Authentication**: JWT (jose library) + bcryptjs
- **State Management**: React Context API
- **Analytics**: Built-in visitor tracking

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm 8+

### Installation

```bash
# Navigate to project directory
cd d:\Treta\treta-web

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser, then navigate to [http://localhost:3000/login](http://localhost:3000/login).

### Test Accounts

Use these credentials to test the dashboard:

| Username | Password | Role | Capabilities |
|----------|----------|------|--------------|
| superadmin | superpass | superadmin | Full access + user management |
| admin1 | password123 | admin | Content management |
| admin2 | admin456 | admin | Content management |

**⚠️ IMPORTANT**: Change these passwords before production deployment!

---

## 🔒 Security Implementation

### Authentication System

#### Password Security
- **Hashing**: bcryptjs with 10-salt rounds (industry standard)
- **Storage**: Passwords never stored in plaintext
- **Verification**: Secure comparison using bcryptjs.compare()
- **Location**: `src/utils/auth.ts`

#### JWT Tokens
- **Library**: jose (official JWT library with proper cryptographic operations)
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Expiration**: 24 hours from generation
- **Secret**: Stored in `.env.local` (JWT_SECRET environment variable)
- **Verification**: Server-side validation on all protected routes
- **Storage**: 
  - Primary: HttpOnly cookies (secure, not accessible to JavaScript)
  - Fallback: localStorage (for client-side state)

#### Session Management
- **Token Restoration**: Automatic restoration on page refresh
- **Cookie Flags**:
  - `httpOnly: true` - Prevents XSS attacks
  - `secure: true` - HTTPS only in production
  - `sameSite: 'strict'` - Prevents CSRF attacks
- **Logout**: Clears both cookie and localStorage

### API Security

#### Rate Limiting
- **Login Endpoint**: 5 attempts per 15 minutes per IP address
- **Implementation**: In-memory Map (development) / Redis recommended (production)
- **Response**: HTTP 429 (Too Many Requests) when limit exceeded
- **Location**: `src/app/api/login/route.ts`

#### Input Validation
- **Section Names**: Whitelist of 11 allowed sections
- **File Types**: Whitelist (JPEG, PNG, WebP, GIF)
- **File Sizes**: Maximum 5MB per upload
- **Filenames**: Sanitized to remove special characters
- **Required Fields**: Validated on all API endpoints

#### Directory Traversal Prevention
- **Method**: `path.resolve()` validation
- **Protection**: Validates resolved paths are within allowed directories
- **Implementation**: Both `/api/update-section` and `/api/upload` endpoints
- **Prevention**: Blocks `../` escape sequences and path manipulation

#### Protected Endpoints
All sensitive endpoints require JWT authentication and admin role:
- `POST /api/update-section` - Update content sections
- `POST /api/upload` - Upload images
- `POST /api/user-management` - Manage users (superadmin only)

### Authorization (Role-Based Access Control)

#### Roles
- **superadmin**: Full access including user management
- **admin**: Content management and uploads
- **user**: Reserved for future use

#### Enforcement
- JWT token contains user role
- Server-side verification on every protected request
- Admin role required for content updates
- Superadmin role required for user management

---

## 🧪 Testing

### Manual Testing

#### 1. Login Flow
```bash
# Navigate to login page
http://localhost:3000/login

# Use credentials
Username: admin1
Password: password123

# Should redirect to dashboard
http://localhost:3000/dashboard
```

#### 2. Rate Limiting Test
- Attempt to log in with wrong password 6 times
- On 6th attempt, should see "Too many login attempts"
- Wait 15 minutes for limit to reset

#### 3. Dashboard Features
- Click any section (e.g., "Hero")
- Edit content
- Click "Save" - should succeed with admin token
- Changes should persist after refresh

### API Testing with cURL

#### Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","password":"password123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin1",
    "name": "Admin User",
    "role": "admin"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Update Section (Authenticated)
```bash
curl -X POST http://localhost:3000/api/update-section \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "sectionName": "hero",
    "data": {"title": "Updated Title"}
  }'
```

#### Test Unauthorized Access
```bash
curl -X POST http://localhost:3000/api/update-section \
  -H "Content-Type: application/json" \
  -d '{"sectionName":"hero","data":{}}'
```

**Expected Response (HTTP 401):**
```json
{"error": "Unauthorized"}
```

### Security Feature Verification

✅ **JWT Token Verification**: Tokens verified on every protected request  
✅ **Password Hashing**: All passwords bcryptjs-hashed with 10 salt rounds  
✅ **Role-Based Access**: Admin role required for content operations  
✅ **Rate Limiting**: 5 attempts per 15 minutes enforced  
✅ **Directory Traversal Prevention**: Path validation blocks malicious paths  
✅ **File Upload Validation**: Type and size limits enforced  
✅ **HttpOnly Cookies**: Token not accessible to JavaScript  
✅ **Session Expiration**: 24-hour automatic expiration  

---

## 👥 User Management

### Overview
Superadmins can create new users and manage password resets via email-based tokens.

### Creating a New User (Superadmin Only)

#### Via Dashboard
1. Log in as superadmin
2. Navigate to dashboard
3. Find "User Management" section
4. Fill in username, name, and email
5. Click "Create User"
6. Copy the reset link from the response
7. Send link to user via email

#### Via API
```bash
# 1. Login as superadmin
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"superpass"}' \
  -c cookies.txt

# 2. Create user
curl -X POST http://localhost:3000/api/user-management \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "action": "create-user",
    "username": "john.doe",
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

### Password Reset Flow
1. Superadmin creates user → Reset token generated (6-hour expiration)
2. User receives reset link: `http://localhost:3000/reset-password?token=XXX`
3. User clicks link and sets new password
4. User is redirected to login page
5. User logs in with new credentials

### User Management Actions

#### Update User
```bash
curl -X POST http://localhost:3000/api/user-management \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "action": "update-user",
    "userId": 5,
    "username": "john.smith",
    "name": "John Smith",
    "email": "john.smith@example.com"
  }'
```

#### Delete User
```bash
curl -X POST http://localhost:3000/api/user-management \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "action": "delete-user",
    "userId": 5
  }'
```

#### Send Reset Link
```bash
curl -X POST http://localhost:3000/api/user-management \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "action": "send-reset-link",
    "userId": 5
  }'
```

---

## 📡 API Reference

### Authentication Endpoints

#### POST /api/login
Authenticate user and generate JWT token.

**Request:**
```json
{
  "username": "admin1",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin1",
    "name": "Admin User",
    "role": "admin"
  },
  "token": "eyJ0eXAiOiJKV1Qi..."
}
```

**Response (Failed):**
```json
{
  "error": "Invalid credentials"
}
```

**Rate Limit:** 5 attempts per 15 minutes per IP

---

### Content Management Endpoints

#### POST /api/update-section
Update content section (requires admin role).

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request:**
```json
{
  "sectionName": "hero",
  "data": {
    "title": "New Title",
    "subtitle": "New Subtitle"
  }
}
```

**Allowed Sections:**
- hero, about, services, numbers, values
- caseStudies, faq, footer, header, cta, meta

**Response (Success):**
```json
{
  "success": true,
  "message": "Section updated successfully"
}
```

---

#### POST /api/upload
Upload image to specific section (requires admin role).

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: Image file (JPEG, PNG, WebP, GIF)
- `sectionName`: Section identifier

**Constraints:**
- Max file size: 5MB
- Allowed types: image/jpeg, image/png, image/webp, image/gif

**Response (Success):**
```json
{
  "success": true,
  "filePath": "/images/hero/1234567890_filename.jpg"
}
```

---

### User Management Endpoints

#### POST /api/user-management
Manage users (requires superadmin role).

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Actions:**
- `create-user` - Create new user with email
- `update-user` - Update user information
- `delete-user` - Remove user
- `send-reset-link` - Generate password reset token
- `verify-reset-token` - Validate reset token
- `reset-password` - Set new password with valid token

---

#### GET /api/get-users
Retrieve user list (requires superadmin role).

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "username": "admin1",
      "name": "Admin User",
      "email": "admin1@example.com",
      "role": "admin"
    }
  ]
}
```

---

## 🚀 Deployment

### Pre-Deployment Checklist

#### 1. Generate Production JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output (64-character hex string).

#### 2. Create Production Environment File
Create `.env.production.local`:
```
JWT_SECRET=<your-generated-secret-here>
NODE_ENV=production
```

**⚠️ CRITICAL**: Never commit this file to git!

#### 3. Update User Passwords
```bash
# Run password hashing script
node scripts/hashPasswords.js
```
- Select option 1 for each user
- Use strong passwords (minimum 12 characters)
- Mix uppercase, lowercase, numbers, symbols

#### 4. Set Up HTTPS/SSL
- Obtain SSL certificate (Let's Encrypt recommended)
- Configure HTTPS on your server
- Verify secure flag is enabled in cookies
- Set up HTTP to HTTPS redirect

#### 5. Security Headers
Add to `next.config.ts`:
```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        }
      ]
    }
  ]
}
```

#### 6. Rate Limiting (Production)
Migrate from in-memory to Redis:
```bash
npm install ioredis
```

Update rate limiting logic in `/api/login/route.ts` to use Redis.

#### 7. Monitoring & Logging
- Set up application logging
- Log authentication attempts
- Log failed login attempts
- Set up alerts for security events
- Monitor rate limit violations

#### 8. Backup Strategy
- Automate backups of `/public/SiteContent/`
- Test backup restoration
- Store backups securely off-site
- Implement daily/weekly schedule

#### 9. Dependency Audit
```bash
npm audit
npm audit fix
```

#### 10. Build & Test
```bash
npm run build
npm run start
```

Test all functionality in production mode before deployment.

---

## 📁 Project Structure

```
treta-web/
├── public/
│   ├── images/              # Uploaded images
│   │   ├── hero/
│   │   └── about/
│   └── SiteContent/         # JSON data files
│       ├── users.json       # User credentials (hashed)
│       ├── hero.json
│       ├── about.json
│       └── ...
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── login/
│   │   │   │   └── route.ts           # Authentication endpoint
│   │   │   ├── update-section/
│   │   │   │   └── route.ts           # Content update (protected)
│   │   │   ├── upload/
│   │   │   │   └── route.ts           # Image upload (protected)
│   │   │   ├── user-management/
│   │   │   │   └── route.ts           # User CRUD (superadmin)
│   │   │   └── get-users/
│   │   │       └── route.ts           # Get user list (superadmin)
│   │   │
│   │   ├── dashboard/
│   │   │   ├── page.tsx               # Dashboard home
│   │   │   ├── [section]/
│   │   │   │   └── page.tsx           # Section editor
│   │   │   └── users/
│   │   │       └── page.tsx           # User management UI
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx               # Login page
│   │   │
│   │   ├── reset-password/
│   │   │   └── page.tsx               # Password reset page
│   │   │
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Homepage
│   │   └── globals.css                # Global styles
│   │
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   ├── NumbersSection.tsx
│   │   ├── Values.tsx
│   │   ├── CaseStudies.tsx
│   │   ├── FAQ.tsx
│   │   ├── CTA.tsx
│   │   ├── Footer.tsx
│   │   ├── UserManagement.tsx         # User creation form
│   │   └── ClientLayout.tsx
│   │
│   ├── context/
│   │   ├── AuthContext.tsx            # Authentication state
│   │   ├── MetaContext.tsx            # Global meta settings
│   │   └── ThemeContext.tsx           # Theme management
│   │
│   └── utils/
│       ├── auth.ts                    # Auth utilities
│       ├── encryption.ts              # Encryption helpers
│       ├── jwt.ts                     # JWT utilities
│       └── analytics.ts               # Analytics tracking
│
├── scripts/
│   ├── hashPasswords.js               # Password hashing tool
│   ├── encrypt-users.ts               # User encryption
│   └── view-users.ts                  # View user data
│
├── .env.local                         # Development environment variables
├── .env.production.local              # Production environment variables (create this)
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.js
└── README.md                          # This file
```

---

## 🛠 Troubleshooting

### Login Issues

#### "Invalid credentials" Error
**Cause**: Wrong username or password  
**Solution**: 
- Verify credentials are correct
- Check for typos (case-sensitive)
- Ensure password hasn't been changed
- Try another test account

#### "Too many login attempts"
**Cause**: Rate limit exceeded (5 attempts per 15 minutes)  
**Solution**: 
- Wait 15 minutes before trying again
- Check if correct IP is being used
- In development, restart server to reset in-memory rate limiter

#### "Unauthorized" After Login
**Cause**: JWT token not being stored or sent properly  
**Solution**: 
- Check browser console for errors
- Verify cookies are enabled
- Check localStorage for token
- Try logging out and back in
- Clear browser cache and cookies

### API Issues

#### 401 Unauthorized on Protected Endpoints
**Cause**: Missing or invalid JWT token  
**Solution**: 
- Verify token is being sent in Authorization header
- Check token hasn't expired (24-hour limit)
- Ensure token format: `Bearer <token>`
- Try logging in again to get fresh token

#### 403 Forbidden Error
**Cause**: Insufficient permissions (non-admin user)  
**Solution**: 
- Verify user has admin or superadmin role
- Check `users.json` for correct role assignment
- Ensure JWT contains correct role information

#### 429 Too Many Requests
**Cause**: Rate limit exceeded  
**Solution**: 
- Wait for rate limit window to reset
- Check if legitimate traffic or attack
- Consider increasing rate limits in production

### File Upload Issues

#### "File too large" Error
**Cause**: File exceeds 5MB limit  
**Solution**: 
- Compress image before uploading
- Use image optimization tools
- Check file size before upload
- Consider increasing limit if needed

#### "Invalid file type" Error
**Cause**: File is not an allowed image type  
**Solution**: 
- Only use JPEG, PNG, WebP, or GIF
- Convert file to supported format
- Check file extension matches actual type

#### Upload Fails Silently
**Cause**: Directory permissions or path issues  
**Solution**: 
- Check `public/images/` directory exists
- Verify write permissions on images folder
- Check server logs for errors
- Ensure section folder exists

### Environment Issues

#### "JWT_SECRET not found" Error
**Cause**: Missing environment variable  
**Solution**: 
- Ensure `.env.local` file exists in project root
- Verify file contains `JWT_SECRET=<value>`
- Restart development server after creating file
- Check file isn't named `.env.local.txt`

#### Changes Not Reflecting
**Cause**: Cached data or server not restarted  
**Solution**: 
- Restart development server (`npm run dev`)
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh browser (Ctrl+F5)
- Check if changes saved to correct file

### Build/Deployment Issues

#### TypeScript Compilation Errors
**Solution**: 
```bash
# Clean build
rm -rf .next
npm run build
```

#### Missing Dependencies
**Solution**: 
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Environment Variables Not Working in Production
**Solution**: 
- Create `.env.production.local` (not `.env.local`)
- Verify environment variables are set on hosting platform
- Restart production server after changes
- Check server logs for variable loading

### Password Reset Issues

#### Reset Link Doesn't Work
**Cause**: Token expired or invalid  
**Solution**: 
- Tokens expire after 6 hours
- Generate new reset link
- Check URL was copied correctly
- Ensure no spaces in token

#### Can't Access Reset Password Page
**Cause**: Missing token parameter  
**Solution**: 
- URL must include `?token=<value>`
- Verify entire link was copied
- Try regenerating reset link

### Performance Issues

#### Slow Dashboard Loading
**Solution**: 
- Check network connection
- Verify server has adequate resources
- Check for large image files
- Review server logs for bottlenecks

#### API Response Delays
**Solution**: 
- Check server load and resources
- Verify database/file system performance
- Review rate limiting settings
- Check for network latency

### Security Concerns

#### Suspect Unauthorized Access
**Action**: 
1. Immediately change all admin passwords
2. Review server logs for suspicious activity
3. Check rate limiting logs
4. Rotate JWT_SECRET
5. Force logout all users (change JWT_SECRET)
6. Review recent content changes

#### Password Reset Token Compromised
**Action**: 
1. Token auto-expires in 6 hours
2. Delete user and recreate if needed
3. Generate new reset link
4. Review logs for suspicious activity

### Getting Help

**Before seeking help, collect:**
- Error messages (exact text)
- Browser console logs (F12 → Console)
- Server terminal output
- Steps to reproduce the issue
- Environment (development/production)
- Node.js and npm versions

**Check:**
- [Next.js Documentation](https://nextjs.org/docs)
- [jose JWT Library](https://github.com/panva/jose)
- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)

---

## 📝 Key Files Reference

### Configuration Files
- **`.env.local`** - Development environment variables (JWT_SECRET)
- **`.env.production.local`** - Production environment variables (create this)
- **`next.config.ts`** - Next.js configuration
- **`tsconfig.json`** - TypeScript configuration
- **`tailwind.config.js`** - Tailwind CSS configuration

### Security Files
- **`src/utils/auth.ts`** - Authentication utilities (108 lines)
- **`src/app/api/login/route.ts`** - Login endpoint (102 lines)
- **`public/SiteContent/users.json`** - User credentials (hashed passwords)

### Helper Scripts
- **`scripts/hashPasswords.js`** - Hash passwords for users
- **`scripts/encrypt-users.ts`** - Encrypt user data
- **`scripts/view-users.ts`** - View user information

---

## 🔐 Security Best Practices

### For Development
- ✅ Use provided test credentials
- ✅ Never commit `.env.local` to git
- ✅ Keep dependencies updated (`npm audit`)
- ✅ Test security features regularly
- ✅ Use HTTPS even in development (when possible)

### For Production
- ✅ Generate strong, unique JWT_SECRET
- ✅ Change all default passwords
- ✅ Enable HTTPS/SSL
- ✅ Migrate rate limiting to Redis
- ✅ Set up monitoring and logging
- ✅ Regular security audits
- ✅ Backup data regularly
- ✅ Keep dependencies updated
- ✅ Implement security headers
- ✅ Regular password rotation

### Password Requirements
- Minimum 8 characters (12+ recommended for production)
- Mix of uppercase and lowercase letters
- Include numbers
- Include special characters
- No common words or patterns
- Unique for each user

---

## 📊 Security Implementation Summary

### Implemented Security Measures: 12

1. ✅ **JWT Token Authentication** - Secure token generation and verification
2. ✅ **Bcryptjs Password Hashing** - 10-salt round hashing
3. ✅ **Rate Limiting** - 5 login attempts per 15 minutes per IP
4. ✅ **Role-Based Access Control** - Admin role verification
5. ✅ **Input Validation** - Whitelist validation for sections and files
6. ✅ **Directory Traversal Prevention** - Path resolution validation
7. ✅ **Filename Sanitization** - Special character removal
8. ✅ **File Upload Validation** - Type and size checks
9. ✅ **HttpOnly Cookies** - XSS protection
10. ✅ **SameSite Cookies** - CSRF protection
11. ✅ **Secure Flag** - HTTPS enforcement in production
12. ✅ **Proper Error Handling** - Appropriate HTTP status codes

### Dependencies
- **bcryptjs@2.4.3** - Password hashing with salting
- **jose@5.x.x** - JWT token operations (HS256 algorithm)

### Build Status
✅ Compiles successfully  
✅ TypeScript validation passes  
✅ All routes functional  
✅ Zero critical vulnerabilities  

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 🤝 Support

For issues, questions, or security concerns:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review error messages in browser console
3. Check server terminal output
4. Verify environment configuration

---

**Last Updated**: December 29, 2025  
**Version**: 1.0.0  
**Status**: Production Ready (after following deployment checklist)
│   │   ├── update-section/ # Content update endpoint
│   │   └── upload/         # Image upload endpoint
│   ├── dashboard/          # Dashboard pages
│   ├── login/              # Login page
│   └── page.tsx            # Home page
├── components/             # React components
├── context/                # React context providers
├── utils/                  # Utility functions
└── app.css                 # Global styles

public/
└── SiteContent/           # Content JSON files
```

## 🔑 Environment Variables

### Development (`.env.local`)
```
JWT_SECRET=your-development-secret-key
NODE_ENV=development
```

### Production (`.env.production.local`)
```
JWT_SECRET=your-production-secret-key-64-chars-minimum
NODE_ENV=production
```

**⚠️ Never commit `.env.local` or `.env.production.local` to git!**

## 📦 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Hash a new password
node scripts/hashPasswords.js
```

## 🔐 Password Management

### Change a User Password

```bash
node scripts/hashPasswords.js
```

Then select option "1. Update user password" and follow the prompts.

### Hash a New Password

```bash
node scripts/hashPasswords.js
```

Select option "2. Hash a password" to generate a hash for new passwords.

## 🚀 Production Deployment

**IMPORTANT**: Follow these steps before deploying to production:

1. **Generate JWT Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Create Production Environment**
   - Create `.env.production.local` with the generated JWT_SECRET
   - Set up HTTPS/SSL certificate

3. **Update Passwords**
   ```bash
   node scripts/hashPasswords.js
   ```
   - Change all test account passwords
   - Use strong passwords (12+ characters)

4. **Review Checklist**
   - See [DEPLOYMENT_SECURITY_CHECKLIST.md](./DEPLOYMENT_SECURITY_CHECKLIST.md) for complete pre-deployment guide

## 🧪 Testing the Security

### Test Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","password":"password123"}'
```

### Test Protected Endpoint
```bash
curl -X POST http://localhost:3000/api/update-section \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"sectionName":"hero","data":{"title":"New Title"}}'
```

## 📊 Content Sections

### Editable Sections
1. **Hero** - Main banner section
2. **About** - About company
3. **Services** - Services offered
4. **Numbers** - Statistics and metrics
5. **Values** - Company values
6. **Case Studies** - Project showcase
7. **FAQ** - Frequently asked questions
8. **Footer** - Footer content
9. **Header** - Navigation menu
10. **CTA** - Call-to-action content
11. **Meta** - Global settings, colors, fonts

## 🎨 Theming

Global theme settings managed through the **Meta** section:
- Primary color (light & dark mode)
- Secondary color (light & dark mode)
- Font family
- SEO meta tags

All colors apply automatically throughout the site using CSS variables.

## 🐛 Troubleshooting

### Login Issues
- Verify credentials are correct (case-sensitive)
- Check user exists in `/public/SiteContent/users.json`
- Check password is hashed (bcryptjs format)

### Dashboard Access
- Token may be expired (24-hour expiration)
- Clear localStorage and try logging in again
- Check browser console for error messages

### Image Upload Fails
- Check file type is supported (JPEG, PNG, WebP, GIF)
- Check file size is under 5MB
- Verify you're logged in as admin

## 📝 License

This project is proprietary and confidential.

## 🤝 Support

For issues, questions, or security concerns, please refer to:
- [SECURITY.md](./SECURITY.md) - Security implementation details
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing procedures

---

**Happy content managing! 🎉**
