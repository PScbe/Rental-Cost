# Meta Ads Integration Documentation

## Overview

This document provides comprehensive information about the Meta Ads integration implemented for Possible Studio. The integration includes both client-side (Meta Pixel) and server-side (Conversions API) tracking to maximize attribution accuracy and conversion tracking.

## Table of Contents

1. [Setup & Configuration](#setup--configuration)
2. [Features](#features)
3. [Event Tracking](#event-tracking)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)
6. [Token Management](#token-management)

---

## Setup & Configuration

### Environment Variables

The integration requires the following environment variables to be configured:

```bash
# Meta Access Token (Required for Conversions API)
VITE_META_ACCESS_TOKEN=your_access_token_here

# Meta Pixel ID (Required for client-side tracking)
VITE_META_PIXEL_ID=your_pixel_id_here

# Meta Ad Account ID (Optional, for advanced features)
VITE_META_AD_ACCOUNT_ID=act_123456789

# Test Event Code (Optional, for testing before going live)
VITE_META_TEST_EVENT_CODE=TEST12345
```

### Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Meta credentials to `.env.local`

3. Restart your development server:
   ```bash
   npm run dev
   ```

### Production Deployment (Netlify)

1. Go to your Netlify dashboard
2. Navigate to: **Site Settings → Build & Deploy → Environment**
3. Add the following environment variables:
   - `VITE_META_ACCESS_TOKEN`
   - `VITE_META_PIXEL_ID`
   - `VITE_META_AD_ACCOUNT_ID` (optional)

4. Redeploy your site

> [!WARNING]
> **Never commit `.env.local` to version control!** It's already in `.gitignore` for security.

---

## Features

### 1. Meta Pixel (Client-Side Tracking)

**Location**: `src/utils/metaPixel.js`

The Meta Pixel tracks user interactions on your website in real-time. It's automatically initialized when the app loads.

**Standard Events Tracked:**
- `PageView` - Automatically tracked on every page/route change
- `ViewContent` - When users view specific content
- `Lead` - When users submit booking forms
- `InitiateCheckout` - When users start the booking process
- `Contact` - When users interact with contact forms
- `Search` - When users search for content
- `Schedule` - When users schedule appointments

**Custom Events:**
You can track custom events using `trackCustomEvent(eventName, parameters)`.

### 2. Conversions API (Server-Side Tracking)

**Location**: `src/utils/metaConversions.js`

The Conversions API sends events directly from your application to Meta's servers, providing:
- Better attribution in iOS 14+ environments
- Deduplication with Pixel events
- More reliable tracking when ad blockers are present

**Features:**
- Automatic event deduplication using event IDs
- User data hashing for privacy compliance
- Cookie-based user matching (fbp, fbc)
- Test mode support

### 3. React Hook for Easy Tracking

**Location**: `src/hooks/useMetaTracking.js`

A custom React hook that provides convenient tracking functions:

```javascript
import { useMetaTracking } from '../hooks/useMetaTracking';

function MyComponent() {
  const { trackLead, trackInitiateCheckout, trackContact } = useMetaTracking();
  
  const handleBooking = () => {
    trackLead({
      name: 'Studio Booking',
      category: 'rental',
      value: 5000,
      currency: 'INR'
    });
  };
  
  return <button onClick={handleBooking}>Book Now</button>;
}
```

---

## Event Tracking

### Automatic Events

The following events are tracked automatically:

| Event | Trigger | Location |
|-------|---------|----------|
| PageView | Every route change | App.jsx (via useMetaTracking hook) |
| InitiateCheckout | Booking confirmation | RentalCalculator.jsx, PackageCalculator.jsx |
| Lead | Booking confirmation | RentalCalculator.jsx, PackageCalculator.jsx |

### Manual Event Tracking

You can manually track events anywhere in your application:

```javascript
import { trackLead, trackContact } from '../utils/metaPixel';

// Track a lead
trackLead({
  name: 'Contact Form',
  category: 'inquiry',
  value: 0,
  currency: 'INR'
});

// Track contact
trackContact({
  name: 'contact_form',
  category: 'inquiry'
});
```

### Event Parameters

Standard parameters for tracking events:

```javascript
{
  name: 'Event Name',           // Required: Name of the content/action
  category: 'Category',          // Optional: Category classification
  value: 5000,                   // Optional: Monetary value in INR
  currency: 'INR',               // Optional: Currency code
  numItems: 3,                   // Optional: Number of items
}
```

---

## Testing

### 1. Meta Pixel Helper (Browser Extension)

Install the [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension to verify Pixel events in real-time.

**Steps:**
1. Install the extension
2. Navigate to your website
3. Click the extension icon to see fired events
4. Verify events are firing correctly with proper parameters

### 2. Meta Events Manager

View all tracked events in Meta Events Manager:

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Select your Pixel
3. Click "Test Events" tab
4. Add your test event code to `.env.local`:
   ```bash
   VITE_META_TEST_EVENT_CODE=TEST12345
   ```
5. Trigger events on your site
6. Verify they appear in the Test Events tab

### 3. Browser Console

Check the browser console for tracking confirmations:

```
Meta Pixel initialized: 1234567890
Meta Pixel event tracked: PageView {}
Meta Pixel event tracked: Lead {name: "Studio Booking", value: 5000}
Meta Conversions API event sent: Lead {...}
```

---

## Troubleshooting

### Pixel Not Loading

**Problem**: Meta Pixel doesn't initialize

**Solutions:**
1. Verify `VITE_META_PIXEL_ID` is set in `.env.local`
2. Check browser console for errors
3. Ensure no ad blockers are interfering
4. Restart development server after adding env variables

### Events Not Showing in Events Manager

**Problem**: Events fire locally but don't appear in Meta Events Manager

**Solutions:**
1. Wait 5-10 minutes for events to process
2. Verify your access token is valid
3. Check that Pixel ID matches your Events Manager
4. Use Test Events mode with a test event code
5. Check browser console for API errors

### Conversions API Errors

**Problem**: Server-side events fail to send

**Solutions:**
1. Verify `VITE_META_ACCESS_TOKEN` is correct
2. Check token hasn't expired
3. Ensure Pixel ID is configured
4. Check browser console for error messages
5. Verify CORS settings if applicable

### Duplicate Events

**Problem**: Same event appears twice in Events Manager

**Solution**: This is expected! The integration sends events via both Pixel (client-side) and Conversions API (server-side). Meta automatically deduplicates these using event IDs.

---

## Token Management

### Access Token Expiration

Meta access tokens can expire. Here's how to manage them:

### Getting a New Access Token

1. Go to [Meta for Developers](https://developers.facebook.com/tools/accesstoken/)
2. Select your app
3. Generate a new access token
4. Copy the token
5. Update your `.env.local` file
6. For production, update Netlify environment variables

### Long-Lived Tokens

For production, use long-lived tokens (60 days):

1. Go to [Meta Business Suite](https://business.facebook.com/)
2. Navigate to **Business Settings → System Users**
3. Create a system user
4. Assign necessary permissions
5. Generate a system user access token
6. Use this token in production

### Token Permissions Required

Your access token needs the following permissions:
- `ads_management`
- `business_management`

---

## Advanced Features

### Advanced Matching

For better attribution, you can send hashed user data:

```javascript
import { setUserData } from '../utils/metaPixel';

setUserData({
  email: 'user@example.com',
  phone: '+919876543210',
  firstName: 'John',
  lastName: 'Doe',
  city: 'Mumbai',
  state: 'Maharashtra',
  country: 'IN'
});
```

### Custom Conversions

Create custom conversions in Meta Events Manager based on tracked events:

1. Go to Events Manager
2. Click "Custom Conversions"
3. Create rules based on your tracked events
4. Use these in your ad campaigns

---

## Best Practices

1. **Always test in Test Events mode** before going live
2. **Monitor Events Manager** regularly for tracking issues
3. **Keep access tokens secure** - never commit to version control
4. **Use descriptive event names** for better reporting
5. **Track value in INR** for accurate ROI measurement
6. **Refresh tokens before expiration** to avoid tracking gaps

---

## Support & Resources

- [Meta Pixel Documentation](https://developers.facebook.com/docs/meta-pixel)
- [Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Meta Events Manager](https://business.facebook.com/events_manager2)
- [Meta Business Help Center](https://www.facebook.com/business/help)

---

## Integration Summary

### Files Created/Modified

**New Files:**
- `src/utils/metaPixel.js` - Meta Pixel integration
- `src/utils/metaConversions.js` - Conversions API integration
- `src/hooks/useMetaTracking.js` - React tracking hook
- `.env.example` - Environment variable template
- `.env.local` - Local environment configuration (gitignored)

**Modified Files:**
- `index.html` - Added Meta Pixel noscript tag
- `src/App.jsx` - Initialize Meta Pixel on app load
- `src/components/booking/RentalCalculator.jsx` - Added booking conversion tracking
- `src/components/booking/PackageCalculator.jsx` - Added package conversion tracking

### Events Currently Tracked

| Event | Location | Trigger |
|-------|----------|---------|
| PageView | All pages | Route change |
| InitiateCheckout | Rental Calculator | Booking confirmation |
| Lead | Rental Calculator | Booking confirmation |
| InitiateCheckout | Package Calculator | Book Package button |
| Lead | Package Calculator | Book Package button |

---

**Last Updated**: November 2025  
**Version**: 1.0
