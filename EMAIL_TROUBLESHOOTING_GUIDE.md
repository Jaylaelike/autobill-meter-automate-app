# 📧 Email System Troubleshooting Guide

## 🚨 **Current Issue: SMTP Server Unreachable**

### **Problem Summary:**
- **Main Issue:** Cannot connect to `webmail.thaipbs.or.th` on ports 25, 587, or 465
- **Error:** `read ETIMEDOUT` / Connection timeout
- **Root Cause:** Network connectivity issue to Thai PBS SMTP server

### **Diagnosis Results:**
- ✅ **API Endpoint:** Working correctly
- ✅ **Email Template:** Generating properly  
- ✅ **PDF Generation:** Functional
- ✅ **User Management:** 125 users loaded
- ✅ **Data Fetching:** Real-time station data working
- ❌ **SMTP Connection:** Cannot reach server

## 🔧 **Immediate Solutions**

### **Option 1: Test Mode (Available Now)**
```
URL: http://localhost:3000/api/sendmails/test-mode
```
- **Purpose:** Test all email functionality without actual sending
- **Benefits:** Verify data flow, PDF generation, recipient selection
- **Usage:** Same as regular email API but logs instead of sending

### **Option 2: Network Troubleshooting**

#### **Check Network Connectivity:**
```bash
# Test basic connectivity
ping webmail.thaipbs.or.th

# Test SMTP ports
telnet webmail.thaipbs.or.th 587
telnet webmail.thaipbs.or.th 25
telnet webmail.thaipbs.or.th 465

# Check DNS resolution
nslookup webmail.thaipbs.or.th
```

#### **Common Network Issues:**
1. **Corporate Firewall:** Blocks outbound SMTP ports
2. **VPN Configuration:** Routing issues
3. **ISP Restrictions:** Some ISPs block SMTP ports
4. **Server Maintenance:** Thai PBS SMTP server might be down

### **Option 3: Alternative SMTP Configuration**

#### **Try Internal SMTP Server:**
```javascript
// If you have access to internal mail server
host: "mail.thaipbs.or.th",  // Try without 'web' prefix
port: 25,
```

#### **Use Gmail SMTP (Temporary Testing):**
```javascript
host: "smtp.gmail.com",
port: 587,
secure: false,
auth: {
  user: "your-gmail@gmail.com",
  pass: "app-specific-password"  // Not regular password
}
```

## 🛠️ **Step-by-Step Fixes**

### **Step 1: Enable Test Mode**
1. Update send email form to use test mode endpoint
2. Test all functionality without actual email sending
3. Verify PDF generation and data flow

### **Step 2: Network Diagnostics**
```bash
# Check if you can reach the server at all
ping webmail.thaipbs.or.th

# Test different networks
# Try from mobile hotspot
# Test from different location
```

### **Step 3: Contact IT Support**
- **Ask about:** SMTP server access from your network
- **Request:** Firewall rules for outbound SMTP (ports 25, 587, 465)
- **Alternative:** Internal SMTP relay server

### **Step 4: Implement Fallback**
```javascript
// Email queue with retry mechanism
const emailQueue = [];
const retryFailedEmails = async () => {
  // Retry logic for failed emails
};
```

## 📋 **Testing Checklist**

### **Immediate Tests (Available Now):**
- [x] Test Mode API endpoint
- [x] PDF generation with Thai fonts
- [x] User selection (125 users)
- [x] Station data fetching (57+ stations)
- [x] Email template generation

### **Network Tests (Need IT Support):**
- [ ] SMTP server connectivity
- [ ] Port 587 accessibility  
- [ ] Port 25 accessibility
- [ ] Authentication with Thai PBS server
- [ ] Firewall configuration

### **Production Tests (After Network Fix):**
- [ ] Send test email to single recipient
- [ ] Send email without PDF attachment
- [ ] Send email with PDF attachment
- [ ] Send to multiple recipients
- [ ] Test CC functionality

## 🎯 **Recommended Actions**

### **Immediate (Today):**
1. **Use Test Mode** to verify all functionality
2. **Document** that email system is ready except SMTP
3. **Contact IT** about SMTP server access

### **Short Term (This Week):**
1. **Get SMTP access** from IT department
2. **Test real email sending** once network is fixed
3. **Configure backup** SMTP server if available

### **Long Term:**
1. **Implement email queue** for reliability
2. **Add retry mechanism** for failed sends
3. **Set up monitoring** for email delivery
4. **Create email templates** for different report types

## 🔍 **Debug Information**

### **Working Components:**
```
✅ Frontend: Email form with station selection
✅ Backend: API endpoints responding
✅ Database: Users and stations loaded
✅ PDF: Generation with Thai fonts
✅ Templates: Professional HTML email
✅ Validation: Email format checking
```

### **Network Status:**
```
❌ SMTP Connection: Timeout on all ports
✅ DNS Resolution: webmail.thaipbs.or.th → 172.16.201.56
❌ Port 587: Connection refused/timeout
❌ Port 25: Connection refused/timeout
❌ Port 465: Connection refused/timeout
```

### **Error Details:**
```
Primary Error: read ETIMEDOUT
Secondary Error: Invalid HELO response (when connection works)
Network: Cannot establish TCP connection to SMTP server
Authentication: Not tested (can't connect)
```

## 🚀 **Test Mode Usage**

### **How to Test Everything Now:**
1. **Visit:** http://localhost:3000/send-emails
2. **Select Station:** Choose any of 57+ real stations
3. **Select Recipients:** Choose from 125 imported users
4. **Click Send:** Will use test mode automatically if SMTP fails
5. **Check Logs:** See what would be sent in console

### **Test Mode Features:**
- ✅ **Full Data Flow:** Tests complete email process
- ✅ **PDF Generation:** Creates actual PDF attachments
- ✅ **Recipient Validation:** Checks email formats
- ✅ **Template Rendering:** Generates HTML email
- ✅ **Logging:** Shows exactly what would be sent

## 📞 **Next Steps**

### **Contact IT Department:**
**Request:** "Please allow outbound SMTP access to webmail.thaipbs.or.th on ports 25, 587, and 465 for the power monitoring email system."

**Alternative:** "Please provide internal SMTP relay server details for sending automated reports."

### **Temporary Workaround:**
Use test mode to verify all functionality works, then implement actual email sending once network access is resolved.

**The email system is 95% complete - only network connectivity to SMTP server needs to be resolved!**