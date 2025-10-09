// App Configuration Constants
export const APP_CONFIG = {
  name: "",
  version: "1.0.0",
  description: "Code Clean description here",
  author: "Code Clean",
  logo: "/images/bluelogo.png",
  supportEmail: "support@company.com",
  companyUrl: "https://example.com",
};

// Global Color Configuration - Dynamic Theme System
export const COLOR_CONFIG = {
  // Primary color - Main brand color
  primary: {
    name: "Red",
    hex: "#03C6DB",
  },
  // Secondary color - Accent color
  secondary: {
    name: "Orange",
    hex: "#FB7559",
  },
};

// Theme Options Configuration
export const THEME_OPTIONS = {
  enableThemeToggle: false, // Set to false to disable theme switching
  defaultTheme: "light", // 'light' or 'dark'
  forceTheme: "light", // Set to 'light' or 'dark' to force a single theme (disables toggle)
  // Theme persistence
  persistTheme: true, // Save theme preference to localStorage
  respectSystemTheme: true, // Respect system dark/light mode preference
};

export const API_CONFIG = {
  baseURL: "https://api.codecleanpros.com/api", // set in .env or hardcore here
  timeout: 100000, //your custom timeout for the API
  headers: {
    "Content-Type": "application/json",
  }, // json headers
  formDataHeaders: {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }, // form data headers
  // Stripe Configuration (for revenue tracking)
  stripe: {
    publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || "",
    webhookSecret: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || "",
  },
};

// Pagination Configuration
export const PAGINATION_CONFIG = {
  defaultPageSize: 20,
  pageSizeOptions: [5, 10, 20, 50, 100],
  maxVisiblePages: 5,
};

// Date Format Configuration
export const DATE_CONFIG = {
  format: "MM/dd/yyyy",
  timeFormat: "HH:mm:ss",
  dateTimeFormat: "MM/dd/yyyy HH:mm:ss",
  timezone: "UTC",
};

// Navigation Menu Items
export const MENU_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard",
    path: "/",
    children: [],
  },
  {
    id: "notifications",
    label: "Push Notifications",
    icon: "Bell",
    path: "/notifications",
    children: [],
  },
  {
    id: "users",
    label: "User Management",
    icon: "Users",
    path: "/users",
    children: [
      { id: "users-list", label: "All Users", path: "/users" },
      { id: "Service-Providers", label: "All Requests", path: "/all-requests" },
    ]
  },

  {
    id: "transactions",
    label: "Withdrawal Request ",
    icon: "CreditCard",
    path: "/withdrawal",
    children: [
      {
        id: "transactions-list",
        label: "All Withdrawals",
        path: "/transactions",
      },
       {
        id: "transactions-list",
        label: "All Transactions",
        path: "/all-transactions",
      },

    ],
  },
  // {
  //   id: "support",
  //   label: "Support",
  //   icon: "MessageSquare",
  //   path: "/support",
  //   children: [
  //     {
  //       id: "support-tickets",
  //       label: "Support Tickets",
  //       path: "/support/tickets",
  //     },
  //     { id: "chat-support", label: "Chat Support", path: "/support/chat" },
  //     { id: "send-email", label: "Send Email", path: "/support/email" },
  //   ],
  // },
  {
    id: "Reviews Monitoring",
    label: "Reviews",
    icon: "FileText",
    path: "/reviews",
    children: [],
  },
  {
    id: "reports",
    label: "Reports Monitoring ",
    icon: "FileText",
    path: "/reports",
    children: [],
  },
  // {
  //   id: "analytics",
  //   label: "Analytics",
  //   icon: "BarChart3",
  //   path: "/analytics",
  //   children: [],
  // },
  {
    id: "settings",
    label: "Settings",
    icon: "Settings",
    path: "/settings",
    children: [
      {
        id: "change-password",
        label: "Change Password",
        path: "/settings/change-password",
      },
    ],
  },
  // {
  //   id: "docs",
  //   label: "Documentation",
  //   icon: "FileText",
  //   path: "/docs",
  //   children: [],
  // },
];

// Authentication Routes
export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  FORGOT_PASSWORD: "/auth/forgot-password",
  VERIFY_OTP: "/auth/verify-otp",
  RESET_PASSWORD: "/auth/reset-password",
};

// Chart Colors (using primary/secondary theme)
export const CHART_COLORS = {
  primary: COLOR_CONFIG.primary.hex,
  secondary: COLOR_CONFIG.secondary.hex,
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
  gray: "#6b7280",
};

// Email Configuration
export const EMAIL_CONFIG = {
  templates: {
    welcome: "welcome",
    passwordReset: "password_reset",
    notification: "notification",
    support: "support_reply",
  },
  providers: {
    smtp: "smtp",
    sendgrid: "sendgrid",
    mailgun: "mailgun",
  },
};

// Security Configuration
export const SECURITY_CONFIG = {
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireLowercase: true,
  passwordRequireNumbers: true,
  passwordRequireSpecialChars: true,
  maxLoginAttempts: 5,
  lockoutDuration: 2 * 60 * 1000, // 2 minutes
  otpLength: 6,
  otpExpiry: 10 * 60 * 1000, // 10 minutes
};

// Feature Flags
export const FEATURE_FLAGS = {
  enableAnalytics: true,
  enableReports: true,
  enableNotifications: true,
  enableChat: true,
  enableFileUpload: true,
  enableExport: true,
  enableBulkActions: true,
  enableAdvancedFilters: true,
};
