# Email Reminder System - WarrantyAI

## Overview
The Email Reminder System automatically sends email notifications to users when their warranties are about to expire (within 5 days). This system runs both automatically on a schedule and can be triggered manually.

## Recent Updates
- **Frontend Improvements:**
  - The user menu now includes a direct Dashboard navigation option, making it easier for users to access their dashboard from anywhere in the app.
  - The manual warranty entry form now provides a preview for uploaded invoice files (image or PDF) and allows users to remove the selected invoice file before submission.
- **Deployment Clarification:**
  - For Vercel deployments, the `vercel.json` file must be placed inside the `Frontend/` directory (not the project root) to ensure correct SPA routing and prevent 404 errors on direct route access.

## How It Works

### 1. **Warranty Status Calculation**
The system calculates warranty status based on the `warrantyEnd` date:
- **Active**: More than 5 days until expiration
- **Expiring Soon**: 5 days or less until expiration
- **Expired**: Past the warranty end date

### 2. **Automatic Scheduling**
- **Initial Check**: Runs 5 seconds after server startup
- **Daily Check**: Runs every 24 hours automatically
- **Manual Trigger**: Can be triggered via API endpoint

### 3. **Email Notification Process**
When a warranty status changes to "expiring soon":
1. System fetches user information (email, name)
2. Generates a professional email using Mailgen
3. Sends email via Gmail SMTP
4. Only errors are logged for monitoring

#### Forgot Password Help via Email
- If a user forgets their password, they can request a password reset from the login or forgot password page.
- The system sends a secure password reset link to the user's registered email address.
- The link is valid for a limited time and can only be used once.
- The user clicks the link, sets a new password, and regains access to their account.

## System Components

### Core Files:
- `utlis/warrantyScheduler.js` - Main scheduler logic
- `controller/emailController.js` - Email sending functionality
- `models/warranty.js` - Warranty data model
- `models/user.js` - User data model
- `server.js` - Server initialization with scheduler

### Key Functions:

#### `checkWarrantyStatuses()`
- Fetches all non-expired warranties
- Calculates current status for each warranty
- Updates status in database if changed
- Sends email reminders for "expiring soon" warranties

#### `sendWarrantyReminder(userEmail, userName, warrantyData)`
- Generates professional HTML email
- Includes warranty details in a table format
- Sends via Gmail SMTP
- Returns success/failure status

#### `sendWelcomeEmail(userEmail, userName)`
- Sends a welcome email to new users after registration
- Highlights key features and provides a dashboard link

#### `sendProfileUpdateEmail(userEmail, userName, updatedFields)`
- Notifies users when their profile (name, email, or password) is updated
- Lists the updated fields for transparency and security

#### `sendAccountDeletionEmail(userEmail, userName)`
- Sends a confirmation email after a user deletes their account
- Provides a support contact and a message of appreciation

#### `scheduleWarrantyCheck()`
- Initializes the scheduler
- Runs initial check after server startup
- Sets up daily recurring checks

## API Endpoints

### Manual Trigger
```
POST /checkWarrantyStatuses
```
Triggers a manual warranty status check and email sending.

### Test Email
```
POST /sendWarrantyReminder
Body: { userEmail, userName, warrantyData }
```
Sends a test warranty reminder email.

### Forgot Password (User Help)
```
POST /forgot-password
Body: { email }
```
- Sends a password reset link to the user's email if the email is registered.
- The user can use the link to securely reset their password.

### Welcome Email (automatic)
- Sent automatically after user registration.

### Profile Update Email (automatic)
- Sent automatically after a user changes their name, email, or password.

### Account Deletion Email (automatic)
- Sent automatically after a user deletes their account.

## Environment Variables Required

```env
EMAIL=your-gmail@gmail.com
APP_PASSWORD=your-gmail-app-password
MONGO_URL=your-mongodb-connection-string
```

## Email Template Features

The email includes:
- Personalized greeting with user's name
- Clear warning about expiring warranty
- Product details in a professional table
- Call-to-action button linking to dashboard
- Purchase and warranty end dates
- Product category and brand information

Other email templates:
- Welcome email: Feature highlights, dashboard link, onboarding message
- Profile update email: List of updated fields, security notice
- Account deletion email: Confirmation, support contact, farewell message
- Forgot password email: Secure reset link, instructions for regaining access

## Monitoring and Logging

- Only errors are logged to the server console for debugging and monitoring.
- No debug or status logs are present in production code.

## Troubleshooting

### Common Issues:

1. **Emails not sending**
   - Check Gmail app password is correct
   - Verify EMAIL environment variable
   - Check Gmail 2FA is enabled

2. **No warranties found**
   - Ensure warranties exist in database
   - Check userId references are correct
   - Verify warranty dates are valid

3. **Scheduler not running**
   - Check server logs for initialization errors
   - Verify setInterval is available
   - Check for JavaScript errors

### Debug Mode:
- Only error logs are available in production for security and performance.

## Security Considerations

- Gmail app passwords are used instead of regular passwords
- Environment variables protect sensitive credentials
- Email addresses are validated before sending
- Error handling prevents system crashes
- No sensitive data is logged

## Performance Optimization

- Only processes non-expired warranties
- Uses database indexing on status and dates
- Batches email operations
- Implements proper error handling
- Uses async/await for non-blocking operations

## Testing the System

### 1. Run the test script:
```bash
node test-email-reminder.js
```

### 2. Manual API trigger:
```bash
curl -X POST https://waran-ai.onrender.com/checkWarrantyStatuses
```

### 3. Test individual email:
```bash
curl -X POST https://waran-ai.onrender.com/sendWarrantyReminder \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "test@example.com",
    "userName": "Test User",
    "warrantyData": {
      "productName": "Test Product",
      "brand": "Test Brand",
      "purchaseDate": "2024-01-01",
      "warrantyEnd": "2024-12-20",
      "category": "electronics"
    }
  }'
```

