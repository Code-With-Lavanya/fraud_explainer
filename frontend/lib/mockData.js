/*
 * Pure data pools used to generate mock transactions. Kept dependency-free
 * so both fraudEngine.js and UI components (e.g. the simulator's device /
 * location selects) can import from here without any risk of circular
 * imports.
 */
export const NAMES = ["Mohit", "Aman", "Rahul", "Priya", "Sasang", "Lavanya", "Neha", "Karan", "Store XYZ", "Ravi Traders", "Anita", "Vikram"];
export const DEVICES = ["iPhone 14 (known)", "Redmi Note 12 (known)", "New Android Device", "Unregistered Device", "OnePlus 11 (known)"];
export const LOCATIONS = ["Delhi, IN", "Gurugram, IN", "Mumbai, IN", "Unknown VPN Exit", "Bengaluru, IN"];
