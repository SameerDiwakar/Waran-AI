# Email Reminder System - WarrantyAI

## Overview
The Email Reminder System automatically sends email notifications to users when their warranties are about to expire (within 5 days). This system runs both automatically on a schedule and can be triggered manually.

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

## Email Template Features

The email includes:
- Personalized greeting with user's name
- Clear warning about expiring warranty
- Product details in a professional table
- Call-to-action button linking to dashboard
- Purchase and warranty end dates
- Product category and brand information

## Testing the System

### 1. Run the test script:
```bash
node test-email-reminder.js
```

### 2. Manual API trigger:
```bash
curl -X POST http://localhost:4000/checkWarrantyStatuses
```

### 3. Test individual email:
```bash
curl -X POST http://localhost:4000/sendWarrantyReminder \
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

