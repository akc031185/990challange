# iOS Deployment Guide - GitHub Actions

This guide will help you deploy your 990 Challenge app to the App Store using GitHub Actions.

## Prerequisites

✅ **Apple Developer Account** - Team ID: 5PCJV8QVA7
✅ **GitHub Repository** - https://github.com/akc031185/990challange
✅ **Bundle ID Registered** - com.ninetydaychallenge.app

## Step 1: Create App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps** → **+** → **New App**
3. Fill in details:
   - **Platform**: iOS
   - **Name**: 990 Challenge
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: Select `com.ninetydaychallenge.app` (already registered)
   - **SKU**: `990-challenge-app` (or any unique identifier)
   - **User Access**: Full Access

## Step 2: Generate App Store Connect API Key

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **Users and Access** → **Keys** (under Integrations section in sidebar)
3. Click **Generate API Key** or **+**
4. Name: "GitHub Actions"
5. Access: **App Manager** or **Admin**
6. Click **Generate**
7. **Download the .p8 file** (you can only download once!)
8. Note down:
   - **Key ID** (e.g., ABC123XYZ)
   - **Issuer ID** (found at top of Keys page, e.g., 12345678-1234-1234-1234-123456789012)

## Step 3: Create Certificates Repository (for Fastlane Match)

1. Go to GitHub and create a new **private** repository
   - Name: `990-challenge-certificates`
   - Description: "iOS certificates and provisioning profiles"
   - **Make sure it's PRIVATE**
2. Go to your profile → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. Click **Generate new token (classic)**
4. Name: "Fastlane Match"
5. Expiration: **No expiration** (or 1 year)
6. Select scopes: **repo** (check the main repo checkbox - this gives all repo permissions)
7. Click **Generate token**
8. **Copy the token** (starts with `ghp_` - you won't see it again!)

## Step 4: Create Apple App-Specific Password

1. Go to [appleid.apple.com](https://appleid.apple.com)
2. Sign in with your Apple ID (the one used for Apple Developer)
3. In the **Security** section, under **App-Specific Passwords**, click **Generate Password**
4. Label: "GitHub Actions Fastlane"
5. Click **Create**
6. **Copy the password** (format: xxxx-xxxx-xxxx-xxxx)

## Step 5: Add GitHub Secrets

Go to: https://github.com/akc031185/990challange/settings/secrets/actions

Click **New repository secret** for each of these:

### Required Secrets (8 total):

**1. APPLE_ID**
- Value: Your Apple Developer account email
- Example: `your.email@example.com`

**2. APP_STORE_KEY_ID**
- Value: The Key ID from Step 2
- Example: `ABC123XYZ`

**3. APP_STORE_ISSUER_ID**
- Value: The Issuer ID from Step 2
- Example: `12345678-1234-1234-1234-123456789012`

**4. APP_STORE_KEY_CONTENT**
- Open the .p8 file you downloaded in Step 2 with TextEdit or any text editor
- Copy the **entire content** including:
  ```
  -----BEGIN PRIVATE KEY-----
  [long string of characters]
  -----END PRIVATE KEY-----
  ```
- Paste it as the secret value (all of it, including the BEGIN and END lines)

**5. MATCH_REPO**
- Value: The URL of your certificates repository from Step 3
- Format: `https://github.com/akc031185/990-challenge-certificates`

**6. MATCH_GIT_TOKEN**
- Value: The Personal Access Token from Step 3
- Format: `ghp_xxxxxxxxxxxxxxxxxxxx`

**7. MATCH_PASSWORD**
- Value: Create a strong password to encrypt your certificates
- This can be anything secure - **save it somewhere safe!**
- Example: `MySecurePassword123!`
- You'll need this if you ever need to decrypt certificates later

**8. APPLE_APP_SPECIFIC_PASSWORD**
- Value: The app-specific password from Step 4
- Format: `xxxx-xxxx-xxxx-xxxx` (16 characters with dashes)

## Step 6: Commit and Push GitHub Actions Workflow

The workflow file has been created at `.github/workflows/ios-build.yml`.

Let's commit and push it:

```bash
git add .github/workflows/ios-build.yml
git commit -m "Add GitHub Actions workflow for iOS build and deployment"
git push
```

## Step 7: Trigger the Build

Once all secrets are added and workflow is pushed:

**Option A: Automatic (recommended)**
- Just push any commit to the `main` branch
- The workflow will run automatically

**Option B: Manual trigger**
1. Go to: https://github.com/akc031185/990challange/actions
2. Click **iOS Build and Deploy** workflow
3. Click **Run workflow** → **Run workflow**

## Step 8: Monitor the Build

1. Go to: https://github.com/akc031185/990challange/actions
2. Click on the running workflow
3. Watch the progress - it will take about 15-20 minutes:
   - ✅ Install dependencies
   - ✅ Build the web app
   - ✅ Sync with Capacitor
   - ✅ Create certificates and provisioning profiles
   - ✅ Build iOS app
   - ✅ Upload to TestFlight

## Step 9: Complete App Store Connect Metadata

While the build is processing, fill in your app metadata:

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select **990 Challenge**
3. Go to **App Information** and fill in:
   - **Subtitle**: Short description (30 characters max)
   - **Privacy Policy URL**: Required (create one if you don't have it)
   - **Category**: Primary (e.g., Health & Fitness)
   - **Content Rights**: Check if your app contains third-party content

4. Go to **Version** (should be 1.0) and fill in:
   - **Description**: What your app does (4000 characters max)
   - **Keywords**: Comma-separated (100 characters max)
   - **Support URL**: Where users can get help
   - **Marketing URL**: Optional

5. Upload **Screenshots** (REQUIRED):
   - iPhone 6.7" Display (1290 x 2796 pixels) - at least 3 screenshots
   - iPhone 6.5" Display (1242 x 2688 pixels) - at least 3 screenshots
   - You can use same screenshots for different sizes
   - Take screenshots from the web app or use design tools

6. **App Preview** (Optional):
   - Video preview of your app

## Step 10: Submit for Review

Once the build appears in TestFlight (30-60 mins after upload):

1. Go to your app version in App Store Connect
2. Under **Build**, click **+** and select the uploaded build
3. Fill in **App Review Information**:
   - First Name, Last Name
   - Phone Number
   - Email Address
   - **Demo Account** (if login is required - provide test credentials)
4. Fill in **Version Release**:
   - Manually release this version
   - Or automatically release after approval
5. **Export Compliance**: Answer questions about encryption
6. Click **Add for Review**
7. Click **Submit for Review**

## Troubleshooting

### Build fails with "No profile found"
- Make sure all 8 GitHub secrets are correctly added
- Check that Bundle ID is exactly `com.ninetydaychallenge.app`
- Verify APPLE_ID has access to Team ID 5PCJV8QVA7

### "Invalid API Key"
- Re-download the .p8 file and copy the exact content
- Verify APP_STORE_KEY_ID and APP_STORE_ISSUER_ID are correct

### "Repository not found" for MATCH_REPO
- Ensure certificates repository is **private**
- Check MATCH_GIT_TOKEN has full `repo` scope
- Verify repository name is exact: `https://github.com/akc031185/990-challenge-certificates`

### "Could not decrypt" error
- MATCH_PASSWORD must be the same every time
- Save the password securely for future builds

## Next Steps After Approval

Once approved (typically 1-7 days):
- Your app will be live on the App Store
- Users can download "990 Challenge"
- Monitor reviews and ratings
- Push updates by committing to `main` branch

---

**App Details:**
- Bundle ID: `com.ninetydaychallenge.app`
- Team ID: `5PCJV8QVA7`
- App Name: `990 Challenge`
- Repository: https://github.com/akc031185/990challange
