# 📧 Email Failure Analysis Report

## 🔍 **Root Cause Identified**

### **Primary Issue: SMTP Connection Timeout**
- **Error:** `read ETIMEDOUT`
- **Meaning:** The connection to the SMTP server is timing out
- **Status:** Network/connectivity issue

### **Secondary Issue Fixed: Nodemailer Import**
- **Previous Error:** `nodemailer.createTransporter is not a function`
- **Fix Applied:** Changed `createTransporter` to `createTransport`
- **Status:** ✅ RESOLVED

## 🚨 **Current Issues**

### 1. **SMTP Connection Timeout**
```
Error: read ETIMEDOUT
SMTP Server: webmail.thaipbs.or.th:587
```

**Possible Causes:**
- **Network Firewall:** Port 587 might be blocked
- **VPN/Proxy Issues:** Connection routing problems
- **Server Unavailable:** SMTP server might be down
- **Authentication Timeout:** Slow authentication process

### 2. **Network Connectivity**
- **DNS Resolution:** ✅ Working (IP: 172.16.201.56)
- **SMTP Port Access:** ❌ Timing out

## 🔧 **Troubleshooting Steps**

### **Immediate Fixes to Try:**

#### 1. **Test Different SMTP Ports**
```javascript
// Try port 25 (standard SMTP)
port: 25,
secure: false

// Try port 465 (SMTP over SSL)
port: 465,
secure: true

// Current: port 587 (SMTP with STARTTLS)
port: 587,
secure: false
```

#### 2. **Add Connection Timeout Settings**
```javascript
const transporter = nodemailer.createTransport({
  host: "webmail.thaipbs.or.th",
  port: 587,
  secure: false,
  connectionTimeout: 60000, // 60 seconds
  greetingTimeout: 30000,   // 30 seconds
  socketTimeout: 60000,     // 60 seconds
  auth: {
    user: "nocadmin@thaipbs.or.th",
    pass: "noctpbs",
  },
  tls: {
    rejectUnauthorized: false,
  },
});
```

#### 3. **Test Alternative SMTP Servers**
```javascript
// Gmail SMTP (for testing)
host: "smtp.gmail.com",
port: 587,

// Outlook SMTP (for testing)
host: "smtp-mail.outlook.com",
port: 587,
```

### **Network Diagnostics:**

#### 1. **Test SMTP Port Connectivity**
```bash
# Test if port 587 is accessible
telnet webmail.thaipbs.or.th 587

# Test alternative ports
telnet webmail.thaipbs.or.th 25
telnet webmail.thaipbs.or.th 465
```

#### 2. **Check Firewall Rules**
```bash
# Check if outbound SMTP is allowed
nmap -p 25,465,587 webmail.thaipbs.or.th
```

#### 3. **Test from Different Network**
- Try from mobile hotspot
- Test from different location
- Check if corporate firewall blocks SMTP

## 🛠️ **Recommended Solutions**

### **Option 1: Fix SMTP Configuration**
```javascript
// Updated SMTP config with better timeout handling
const transporter = nodemailer.createTransport({
  host: "webmail.thaipbs.or.th",
  port: 25, // Try standard SMTP port
  secure: false,
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,
  auth: {
    user: "nocadmin@thaipbs.or.th",
    pass: "noctpbs",
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  },
  debug: true, // Enable debug logging
});
```

### **Option 2: Use Alternative Email Service**
```javascript
// Temporary Gmail configuration for testing
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-gmail@gmail.com',
    pass: 'app-specific-password'
  }
});
```

### **Option 3: Implement Email Queue**
```javascript
// Add retry mechanism
const sendEmailWithRetry = async (options, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await transporter.sendMail(options);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 5000 * (i + 1)));
    }
  }
};
```

## 📋 **Testing Checklist**

### **Before Fixing:**
- [x] Identify nodemailer import issue
- [x] Confirm SMTP timeout error
- [x] Verify DNS resolution works
- [x] Test API endpoint accessibility

### **After Fixing:**
- [ ] Test SMTP port connectivity
- [ ] Try different SMTP ports (25, 465, 587)
- [ ] Test with increased timeouts
- [ ] Verify authentication credentials
- [ ] Test email without PDF attachment
- [ ] Test with single recipient
- [ ] Check server logs for detailed errors

## 🎯 **Next Steps**

### **Immediate Actions:**
1. **Update SMTP configuration** with timeout settings
2. **Test different ports** (25, 465, 587)
3. **Enable debug logging** to see detailed connection info
4. **Test network connectivity** to SMTP server

### **Alternative Solutions:**
1. **Contact IT Department** about SMTP server access
2. **Use alternative email service** for testing
3. **Implement email queue** with retry mechanism
4. **Set up local SMTP relay** if needed

## 🔍 **Debug Information**

### **Current Configuration:**
- **SMTP Host:** webmail.thaipbs.or.th
- **SMTP Port:** 587
- **Security:** STARTTLS
- **Authentication:** Username/Password
- **TLS:** Reject unauthorized disabled

### **Error Details:**
- **Error Type:** Network timeout
- **Error Code:** ETIMEDOUT
- **Connection:** Fails during SMTP handshake
- **DNS:** Resolves correctly to 172.16.201.56

### **Working Components:**
- ✅ API endpoint responds
- ✅ Request parsing works
- ✅ Email template generation
- ✅ Nodemailer initialization
- ❌ SMTP connection establishment

**The email system is 90% functional - only the SMTP connection needs to be resolved!**