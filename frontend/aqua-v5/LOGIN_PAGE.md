# AquaConnect Login / Signup

## Login
Login now uses **one identifier field**:
- Phone number (10 digits), OR
- Email address

Password is required.

The selected role matters: Customer accounts can enter the customer home flow, while Vendor accounts enter the vendor dashboard.

## Signup
Signup collects both:
- Mobile number
- Email address
- Password
- Confirm password

Customer signup also collects full name.
Vendor signup also collects owner/authorised person's name and business/vendor name.

After creating an account, switch back to Login and use **either the registered phone number or registered email address** with the password.

This frontend prototype stores demo accounts in localStorage. Real authentication should later be handled by the Node.js/Express backend.
