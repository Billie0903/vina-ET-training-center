# Admin Panel Setup Instructions

## 🔐 Creating an Admin User

### Method 1: Using the Script (Recommended)

1. **Start the server:**
   ```bash
   cd server
   npm run dev
   ```

2. **In a new terminal, create admin user:**
   ```bash
   cd server
   npm run create-admin
   ```

3. **Login with the created admin credentials:**
   - Email: `admin@vina-et.com`
   - Password: `admin123`

### Method 2: Manual Database Update

1. **Connect to your MongoDB database**
2. **Find your user in the `users` collection**
3. **Update the role field:**
   ```javascript
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## 🚀 Accessing the Admin Panel

1. **Login with your admin account**
2. **Click on your user avatar in the top navigation**
3. **Select "Admin Panel" from the dropdown menu**
4. **Or navigate directly to `/admin`**

## 🛡️ Security Features

- **Database-level role verification:** The system checks the user's role directly from the database on every admin request
- **Frontend route protection:** Non-admin users are redirected away from admin routes
- **API endpoint protection:** All admin API endpoints require admin role verification
- **Token validation:** JWT tokens are validated on every request

## 📋 Admin Panel Features

### News Management
- Create, edit, delete news articles
- Upload featured images
- Set categories and tags
- Mark articles as featured or published
- View article statistics

### About Us Management
- Edit different sections of the About page
- Manage content dynamically
- Support for structured data (JSON)
- Publish/unpublish sections

### Statistics Dashboard
- View total news articles
- See published vs draft articles
- Track total views
- Monitor about sections

## 🔧 Troubleshooting

### "Access denied" Error
- Ensure your user has `role: "admin"` in the database
- Check that you're logged in with the correct account
- Verify the JWT token is valid

### "Cannot see anything" in Admin Panel
- Check browser console for JavaScript errors
- Verify server is running on port 3000
- Ensure database connection is working
- Check network tab for failed API requests

### API Connection Issues
- Verify server is running: `npm run dev` in server directory
- Check CORS configuration in server/app.js
- Ensure MongoDB is running and accessible

## 🔄 Changing Admin Password

After first login, change the default password:

1. **Go to your profile (when implemented)**
2. **Or update directly in database:**
   ```javascript
   // The password will be automatically hashed
   db.users.updateOne(
     { email: "admin@vina-et.com" },
     { $set: { password: "your-new-password" } }
   )
   ```

## 📝 Notes

- The admin panel is only accessible to users with `role: "admin"` in the database
- All admin operations are logged and require fresh database verification
- The system automatically redirects non-admin users away from admin routes
- Admin users will see an "Admin Panel" link in their user dropdown menu
