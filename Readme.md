# WaranAI

**WaranAI** is a full-stack web application for managing product warranties, powered by AI-driven document extraction, smart reminders, and a modern user experience. It helps users upload, organize, and track their warranties, receive timely email notifications, and never miss a warranty claim again.

---

## 🚀 Features

### Warranty Management
- **Add Warranties**: Upload warranty documents (images), enter details manually, or scan with AI.
- **AI-Powered OCR**: Extract warranty details from images using Tesseract.js and Google Gemini AI.
- **Smart Reminders**: Receive email notifications before warranties expire.
- **Automatic Status Tracking**: Warranties are marked as active, expiring soon, or expired.

### Email Notification System
- **Welcome Email**: Sent automatically to new users after registration.
- **Profile Update Email**: Notifies users of changes to their profile (name, email, or password).
- **Warranty Expiry Reminder**: Alerts users when a warranty is about to expire.
- **Account Deletion Email**: Confirms account deletion and provides support contact.

### Admin & Automation
- **Daily Scheduler**: Automatically checks warranty statuses and sends reminders.
- **Manual Trigger**: Admins can trigger warranty checks and reminders via API.

### User Experience
- **Modern React Frontend**: Built with Vite, React, TailwindCSS, and shadcn/ui for a beautiful, responsive UI.
- **User Authentication**: Secure registration, login, and profile management with Bcrypt and JWT.
- **Dashboard**: View and manage all your warranties in one place.
- **Settings**: Update profile, change password/email, and manage notification preferences.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, shadcn/ui, RadixUI
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Zod, Multer
- **AI & OCR**: Tesseract.js, Google Gemini AI (for advanced extraction)
- **Email**: Nodemailer, Mailgen, Gmail SMTP
- **Cloud Storage**: Cloudinary (for document uploads)
- **Other**: dotenv, cookie-parser, CORS, bcrypt

---

## 📦 Project Structure

```
WarranAI/
  ├── Backend/
  │   ├── controller/         # API controllers (auth, email, warranty, etc.)
  │   ├── models/             # Mongoose models (User, Warranty)
  │   ├── routes/             # Express route definitions
  │   ├── utlis/              # Utilities (OCR, scheduler, cloudinary)
  │   ├── middleware/         # Multer and other middleware
  │   ├── server.js           # Express app entry point
  │   └── EMAIL_REMINDER_README.md # Detailed email system docs
  └── Frontend/
      ├── src/
      │   ├── components/     # UI and feature components
      │   ├── pages/          # Main app pages (Dashboard, Settings, etc.)
      │   ├── hooks/          # Custom React hooks
      │   └── ...             # Styles, utils, etc.
      └── public/             # Static assets
```

---

## 🧠 How It Works

- **Upload Warranty**: Users upload an image of their warranty/invoice. The backend uses OCR (Tesseract.js) and optionally Google Gemini AI to extract product, brand, purchase date, warranty end, and category.
- **Email Reminders**: The backend checks warranty statuses daily and sends reminders for those expiring soon. Users also receive emails for registration, profile updates, and account deletion.
- **Profile & Security**: All sensitive actions (profile update, account deletion) require password confirmation and notify the user via email.

---

## 🔒 Security

- Passwords are hashed with bcrypt.
- JWT is used for authentication.
- All sensitive credentials are stored in environment variables.
- Email notifications for all critical account actions.

---

## 🧩 Future Integrations & Roadmap

- **OCR for PDF Documents**: Currently, only images are supported. Future versions will support direct OCR extraction from PDF files.
- **OAuth Login**: Google, Microsoft, and Apple login for seamless onboarding.
- **Multi-language Support**: UI and email templates in multiple languages.
- **Mobile App**: Native iOS/Android app for warranty management on the go.
- **Push Notifications**: In-app and mobile push notifications for reminders.
- **Warranty Analytics**: Visualize warranty coverage, expiry trends, and more.
- **Bulk Import/Export**: Import warranties from email receipts or export data for backup.
- **Admin Dashboard**: For managing users, analytics, and system health.

---

See `Backend/EMAIL_REMINDER_README.md` for full details on the email reminder system.

---

## 🤝 Contributing

Pull requests and feature suggestions are welcome! Please open an issue to discuss your idea.

---

## 📧 License & Contact

MIT License.  
For support or business inquiries, contact [diwakarsameer27@gmail.com].

---

**WaranAI — Never lose track of your warranties again!**
