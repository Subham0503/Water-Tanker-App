# AquaConnect Vendor Side – v9

Added a vendor-side prototype matching the existing AquaConnect mobile visual language.

Routes:
- `/vendor` – dashboard, overview, upcoming orders, cancelled-order alert, quick actions
- `/vendor/orders` – All/New/Active/Completed/Cancelled orders; accept/reject new orders
- `/vendor/order/:id` – order details and progress actions
- `/vendor/pricing` – edit tanker prices and Express Delivery charge
- `/vendor/location` – manually update tanker location (prototype, no live GPS)
- `/vendor/earnings` – earnings, available balance, security reserve, transactions
- `/vendor/withdraw` – withdrawal request and locked security reserve information
- `/vendor/verification` – vendor/business/tanker verification information

The ₹10,000 security reserve is a demo platform-policy value, not a claim about a legal requirement.
