# Dynamic customer vendor listings

## What changed
- Customer home requests tanker listings from the backend API; it does not render the static `demoData.js` array.
- The public tanker API returns only available tankers belonging to verified, on-duty, non-demo vendors.
- The selected customer service area is passed through to the available-vendor API and matched against the tanker service area.
- Vendor Pricing now includes an **Add a tanker** form. The new tanker is saved through `POST /api/tankers` and belongs to the signed-in vendor.
- Vendors can pause/enable tankers and save prices. Unavailable tankers do not appear in customer results.
- The seeded `vendor1@aquaconnect.test` demo account is hidden from customer listings, including existing databases where its `isDemo` field has not yet been added. The seed script marks it as demo when run.

## How to use
1. Start the backend with its `.env` configured to point to the same MongoDB database used by the admin dashboard.
2. Start the frontend.
3. Register a vendor and have the admin verify that vendor.
4. Sign in as that vendor, open **Pricing** from the vendor dashboard, and add a tanker with its capacity, vehicle number, price, and service area.
5. Make sure the vendor is **On Duty** and the tanker is **Available**.
6. Sign in as a customer and choose the same service area. The customer home will show the capacity and lowest starting price available from verified vendors in that area. Selecting a capacity shows matching vendors for that same area.

## Important
Existing seed data is still stored in MongoDB; the customer listing API excludes the known seeded demo account rather than deleting database records. Real registered vendors will not appear on the customer home until they have at least one tanker record, are verified by admin, are on duty, and have an available tanker whose service area matches the customer's selected area.
