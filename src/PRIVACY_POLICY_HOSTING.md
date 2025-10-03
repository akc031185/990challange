# Privacy Policy Hosting Guide

## 🌐 Quick Privacy Policy Hosting Solutions

Apple requires a **publicly accessible URL** for your privacy policy. Here are the fastest, free options:

### Option 1: GitHub Pages (Recommended - FREE)

#### Step 1: Create Repository
1. Go to [GitHub.com](https://github.com)
2. Create new repository: `90-day-challenge-privacy`
3. Make it **public**
4. Initialize with README

#### Step 2: Add Privacy Policy
1. Create new file: `index.html`
2. Copy this HTML template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>90-Day Challenge - Privacy Policy</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        h1 { color: #007AFF; }
        h2 { color: #333; margin-top: 30px; }
        .last-updated { color: #666; font-style: italic; }
    </style>
</head>
<body>
    <h1>Privacy Policy for 90-Day Challenge</h1>
    <p class="last-updated">Last updated: December 2024</p>
    
    <!-- Paste your privacy policy content here -->
    
</body>
</html>
```

#### Step 3: Enable GitHub Pages
1. Go to repository **Settings**
2. Scroll to **Pages** section
3. Select **Source**: Deploy from a branch
4. Select **Branch**: main
5. Click **Save**

#### Step 4: Get Your URL
Your privacy policy will be live at:
`https://[your-username].github.io/90-day-challenge-privacy`

---

### Option 2: Netlify (Also FREE)

#### Quick Setup:
1. Go to [Netlify.com](https://netlify.com)
2. Drag & drop HTML file
3. Get instant URL
4. Optional: Customize domain

---

### Option 3: Simple HTML Page

If you have any web hosting, just upload this HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>90-Day Challenge - Privacy Policy</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            line-height: 1.6; 
            background: #f8f9fa;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { 
            color: #007AFF; 
            text-align: center;
            margin-bottom: 10px;
        }
        h2 { 
            color: #333; 
            margin-top: 30px; 
            border-bottom: 2px solid #eee;
            padding-bottom: 5px;
        }
        .last-updated { 
            color: #666; 
            font-style: italic; 
            text-align: center;
            margin-bottom: 30px;
        }
        .contact-info {
            background: #f0f7ff;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Privacy Policy for 90-Day Challenge</h1>
        <p class="last-updated">Last updated: December 2024</p>

        <h2>Overview</h2>
        <p>90-Day Challenge ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application.</p>

        <h2>Information We Collect</h2>
        <h3>Personal Information</h3>
        <ul>
            <li><strong>Account Information:</strong> Name, email address (for app account creation)</li>
            <li><strong>Challenge Data:</strong> Your daily activity completions, progress, and goals</li>
            <li><strong>Team Data:</strong> Team membership, usernames, and leaderboard scores (when you join teams)</li>
        </ul>

        <h3>Health Information (Optional)</h3>
        <ul>
            <li><strong>Apple Health Data:</strong> Calories burned and sleep duration (only with your explicit permission)</li>
            <li><strong>Manual Health Entries:</strong> Sleep hours, calorie targets, supplement lists, workout descriptions</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <h3>Primary Uses:</h3>
        <ul>
            <li><strong>Progress Tracking:</strong> Store and display your 90-day challenge progress</li>
            <li><strong>Team Features:</strong> Enable leaderboards and team collaboration</li>
            <li><strong>Health Integration:</strong> Sync with Apple Health for seamless tracking</li>
            <li><strong>App Improvement:</strong> Analyze usage patterns to enhance features</li>
        </ul>

        <h3>We Do NOT:</h3>
        <ul>
            <li>Sell your personal information to third parties</li>
            <li>Share your health data without permission</li>
            <li>Use your data for advertising</li>
            <li>Access your information unnecessarily</li>
        </ul>

        <h2>Data Storage and Security</h2>
        <h3>Local Storage:</h3>
        <ul>
            <li><strong>Primary Storage:</strong> Most data is stored locally on your device</li>
            <li><strong>Your Control:</strong> You can delete all data by uninstalling the app</li>
        </ul>

        <h3>Security Measures:</h3>
        <ul>
            <li>Industry-standard encryption</li>
            <li>Secure authentication</li>
            <li>Regular security updates</li>
            <li>No plain-text storage of sensitive data</li>
        </ul>

        <h2>Apple Health Integration</h2>
        <h3>How It Works:</h3>
        <ul>
            <li><strong>Permission Required:</strong> We only access health data you explicitly authorize</li>
            <li><strong>Local Processing:</strong> Health data analysis happens on your device</li>
            <li><strong>No Cloud Storage:</strong> Your Apple Health data never leaves your device</li>
            <li><strong>Revocable Access:</strong> You can revoke health permissions anytime</li>
        </ul>

        <h2>Your Rights and Choices</h2>
        <h3>You Can:</h3>
        <ul>
            <li><strong>Access Your Data:</strong> View all stored information in the app</li>
            <li><strong>Delete Your Data:</strong> Remove all personal data by uninstalling</li>
            <li><strong>Control Health Access:</strong> Manage Apple Health permissions in iOS Settings</li>
            <li><strong>Leave Teams:</strong> Remove yourself from team collaboration anytime</li>
        </ul>

        <h2>Children's Privacy</h2>
        <p>90-Day Challenge is designed for users 13 years and older. We do not knowingly collect personal information from children under 13.</p>

        <h2>Changes to This Policy</h2>
        <p>We may update this Privacy Policy occasionally. Continued use of the app after changes constitutes acceptance of the updated policy.</p>

        <div class="contact-info">
            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <p><strong>Email:</strong> [Your Email Address]<br>
            <strong>Subject:</strong> "90-Day Challenge Privacy Policy"</p>
        </div>

        <p><strong>Effective Date:</strong> This Privacy Policy is effective as of the date of the latest app version.</p>
    </div>
</body>
</html>
```

## ✅ What You Need to Do:

1. **Choose Option 1 (GitHub Pages)** - it's free and professional
2. **Replace [Your Email Address]** with your actual contact email
3. **Get the final URL** once it's live
4. **Save this URL** for App Store Connect submission

## 🔗 Example URLs:
- GitHub Pages: `https://yourusername.github.io/90-day-challenge-privacy`
- Netlify: `https://90-day-challenge-privacy.netlify.app`

## ⏱️ Time Required:
- **GitHub Pages:** 10-15 minutes
- **Netlify:** 5 minutes
- **Your own hosting:** 2 minutes (if you have hosting)

**Your privacy policy URL will be required in App Store Connect, so set this up as soon as possible!** 🚀