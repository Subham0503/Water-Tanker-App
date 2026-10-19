# AquaConnect — Safe Editing Guide

## The easiest way to customize the app

Open:

`src/config/appConfig.js`

For normal changes, edit **only this file**. It contains the main demo values used by the vendor earnings/withdrawal screens and the login branding.

### Change the security reserve

Change:

```js
securityReserve: 10000,
```

to:

```js
securityReserve: 15000,
```

Do not add `₹`, commas, or quotes to numeric values.

### Change earnings

```js
totalEarnings: 18450,
pendingAmount: 1250,
```

Use plain numbers.

### Change the app name

```js
name: "AquaConnect",
tagline: "Water tanker booking made simple",
```

### Change recent transactions

Each transaction uses:

```js
{ date: "22 Sep", title: "Order #AF123457", amount: 350 }
```

Positive amounts are earnings. Negative amounts are withdrawals.

## Important rule

The configuration file is the **safe customization area**. You do not need to edit JSX just to change prices, earnings, reserve, transaction amounts, branding, or demo vendor information.

## What can still break a React app?

No system can make arbitrary source-code edits safe. If you edit JSX, imports, brackets, quotes, component names, or JavaScript syntax incorrectly, the project can still fail to compile. For those changes, make one small change at a time and run:

```bash
npm run build
```

If the build succeeds, the source code passed Vite's production compilation step.

## If you want to change the design

For layout, colors, font sizes and spacing, edit the corresponding `.css` file. Keep CSS syntax valid. For example:

```css
background: #eef7ff;
```

not:

```css
background: #eef7ff
```

Both may work in CSS, but avoid deleting braces or semicolons from surrounding rules.

## If you want to change page content

Prefer moving repeated/demo values into `src/config/appConfig.js` rather than inserting numbers directly into JSX.
