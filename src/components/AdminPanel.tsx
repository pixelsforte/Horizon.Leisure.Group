import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Calendar,
  Handshake,
  CheckCircle2,
  Clock,
  Trash2,
  Edit3,
  Search,
  ArrowUpDown,
  X,
  LogOut,
  ChevronRight,
  ShieldAlert,
  CalendarDays,
  FileText,
  MapPin,
  Phone,
  Mail,
  User,
  Plus,
  RefreshCw,
  Info,
  Settings,
  Database,
  Lock,
  Shield,
  PlusCircle,
  Sliders,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  lastActivity: string;
  totalBookings: number;
  totalPartnershipRequests: number;
}

interface Booking {
  id: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  eventType: string;
  guestCount: string;
  eventDate: string;
  venue: string;
  notes?: string;
  bookingStatus: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
}

interface Partnership {
  id: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  fullName: string;
  whatsappNumber: string;
  city: string;
  clubName: string;
  partnershipModel: string;
  message?: string;
  createdAt: string;
}

interface DashboardStats {
  totalCustomers: number;
  totalBookings: number;
  totalPartnershipRequests: number;
  pendingBookings: number;
  completedBookings: number;
  upcomingEvents: Booking[];
}

export default function AdminPanel() {
  // Authentication states
  const [token, setToken] = useState<string | null>(localStorage.getItem("horizon_admin_token"));
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem("horizon_admin_role"));
  const [userFullName, setUserFullName] = useState<string>(localStorage.getItem("horizon_admin_fullName") || "Administrator");
  const [adminEmail, setAdminEmail] = useState<string>(localStorage.getItem("horizon_admin_email") || "");
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // One-time Admin Setup States
  const [setupExists, setSetupExists] = useState<boolean | null>(null);
  const [isProduction, setIsProduction] = useState(false);
  const [setupFullName, setSetupFullName] = useState("");
  const [setupEmail, setSetupEmail] = useState("");
  const [setupPassword, setSetupPassword] = useState("");
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Forgot / Reset Password states
  const [authView, setAuthView] = useState<"login" | "forgot" | "reset">("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState("");

  // Primary Admin Email Change States
  const [pendingEmailChangeToken, setPendingEmailChangeToken] = useState<string | null>(null);
  const [isVerifyingEmailChange, setIsVerifyingEmailChange] = useState(false);
  const [changeEmailPassword, setChangeEmailPassword] = useState("");
  const [changeEmailNewEmail, setChangeEmailNewEmail] = useState("");
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emailChangeStatus, setEmailChangeStatus] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [resetToken, setResetToken] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState("");

  // Check URL query parameters for reset token
  useEffect(() => {
    const checkTokens = () => {
      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get("token");
      if (tokenParam && (window.location.pathname.includes("/reset-password") || window.location.pathname.includes("/hlg-management-portal") || window.location.pathname.includes("/admin/reset-password"))) {
        setResetToken(tokenParam);
        setAuthView("reset");
        setAuthError("");
      }

      const emailTokenParam = params.get("email_change_token");
      if (emailTokenParam) {
        setPendingEmailChangeToken(emailTokenParam);
      }
    };
    checkTokens();
    window.addEventListener("popstate", checkTokens);
    return () => window.removeEventListener("popstate", checkTokens);
  }, []);

  // Active view
  const [activeTab, setActiveTab] = useState<"dashboard" | "customers" | "bookings" | "partnerships" | "users" | "settings" | "account_settings">("dashboard");

  // Data list states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerHistory, setCustomerHistory] = useState<{
    bookings: Booking[];
    partnerships: Partnership[];
  } | null>(null);

  // Expanded collection lists
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [allPartnerships, setAllPartnerships] = useState<Partnership[]>([]);
  const [allAdmins, setAllAdmins] = useState<any[]>([]);

  // Sub-tabs in Customer details
  const [customerSubTab, setCustomerSubTab] = useState<"profile" | "bookings" | "partnerships">("profile");

  // Sub-tabs in Settings panel
  const [settingsSubTab, setSettingsSubTab] = useState<"account" | "roster" | "password">("account");

  // Secure Settings Access Dialog States
  const [showSettingsUnlockModal, setShowSettingsUnlockModal] = useState(false);
  const [settingsUnlockPassword, setSettingsUnlockPassword] = useState("");
  const [settingsUnlockError, setSettingsUnlockError] = useState("");
  const [isVerifyingSettingsPassword, setIsVerifyingSettingsPassword] = useState(false);
  const [isSettingsVerified, setIsSettingsVerified] = useState(false);

  // New self password change states
  const [changePasswordCurrent, setChangePasswordCurrent] = useState("");
  const [changePasswordNew, setChangePasswordNew] = useState("");
  const [changePasswordConfirm, setChangePasswordConfirm] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Tab-specific Filter & Pagination States
  const [bookingsSearch, setBookingsSearch] = useState("");
  const [bookingsStatusFilter, setBookingsStatusFilter] = useState("All");
  const [bookingsSortBy, setBookingsSortBy] = useState("newest");
  const [bookingsPage, setBookingsPage] = useState(1);

  const [partnershipsSearch, setPartnershipsSearch] = useState("");
  const [partnershipsModelFilter, setPartnershipsModelFilter] = useState("All");
  const [partnershipsCityFilter, setPartnershipsCityFilter] = useState("All");
  const [partnershipsSortBy, setPartnershipsSortBy] = useState("newest");
  const [partnershipsPage, setPartnershipsPage] = useState(1);

  const [customersPage, setCustomersPage] = useState(1);

  // User Roster Modals & Actions
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminFullName, setNewAdminFullName] = useState("");
  const [adminSetupError, setAdminSetupError] = useState("");
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  // Admin Self/Roster Edit Password Modal
  const [editingAdmin, setEditingAdmin] = useState<any | null>(null);
  const [editAdminPassword, setEditAdminPassword] = useState("");
  const [editAdminFullName, setEditAdminFullName] = useState("");
  const [isUpdatingAdmin, setIsUpdatingAdmin] = useState(false);

  // Interaction / filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Modals & editing
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    id: string;
    type: "booking" | "partnership" | "admin";
    adminName?: string;
  } | null>(null);

  // Auto-connect database helper status
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; checked: boolean }>({
    connected: false,
    checked: false,
  });

  // Check Admin Setup Status on startup
  const checkSetupStatus = async () => {
    try {
      const res = await fetch("/api/auth/setup-status");
      const data = await res.json();
      setSetupExists(data.exists);
      if (data.isProduction) {
        setIsProduction(true);
      }
    } catch (err) {
      console.error("Failed to fetch setup status:", err);
    }
  };

  useEffect(() => {
    checkSetupStatus();
  }, [token]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupFullName.trim() || !setupEmail.trim() || !setupPassword) {
      setAuthError("All setup fields are required.");
      return;
    }
    if (setupPassword.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }

    setAuthError("");
    setIsSettingUp(true);

    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: setupFullName.trim(),
          email: setupEmail.trim(),
          password: setupPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Setup failed.");
      }

      localStorage.setItem("horizon_admin_token", data.token);
      localStorage.setItem("horizon_admin_role", "super_admin");
      localStorage.setItem("horizon_admin_fullName", setupFullName.trim());
      localStorage.setItem("horizon_admin_email", setupEmail.trim().toLowerCase());
      setToken(data.token);
      setUserRole("super_admin");
      setUserFullName(setupFullName.trim());
      setAdminEmail(setupEmail.trim().toLowerCase());
      setSetupExists(true);
      showToast("First Administrator account created successfully!");
    } catch (err) {
      setAuthError((err as Error).message || "Failed to complete one-time setup.");
    } finally {
      setIsSettingUp(false);
    }
  };

  const handleResetDb = async () => {
    if (!window.confirm("WARNING: Are you absolutely sure you want to reset the local database? This will delete all users, bookings, partnerships, and customers. This action is irreversible.")) {
      return;
    }
    setIsResetting(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/reset-db", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset database.");
      }
      // Reset success
      localStorage.removeItem("horizon_admin_token");
      localStorage.removeItem("horizon_admin_role");
      localStorage.removeItem("horizon_admin_fullName");
      localStorage.removeItem("horizon_admin_email");
      setToken(null);
      setUserRole(null);
      setUserFullName("Administrator");
      setAdminEmail("");
      setSetupExists(false);
      setStats(null);
      setCustomers([]);
      setSelectedCustomer(null);
      setCustomerHistory(null);
      showToast("Local database has been successfully reset! You can now run the One-Time Setup.", "success");
    } catch (err) {
      setAuthError((err as Error).message || "Failed to reset local database.");
    } finally {
      setIsResetting(false);
    }
  };

  // Load Initial data or trigger login
  useEffect(() => {
    if (token) {
      fetchDashboardStats();
      fetchCustomers();
      if (activeTab === "bookings") {
        fetchAllBookings();
      } else if (activeTab === "partnerships") {
        fetchAllPartnerships();
      } else if ((activeTab === "users" || activeTab === "settings" || activeTab === "account_settings") && userRole === "super_admin") {
        fetchAllAdmins();
      }
    }
  }, [token, activeTab, userRole]);

  // Handle toast timers
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle settings routing compatibility mapping
  useEffect(() => {
    if (activeTab === "account_settings") {
      setActiveTab("settings");
      setSettingsSubTab("account");
    } else if (activeTab === "users") {
      setActiveTab("settings");
      setSettingsSubTab("roster");
    }
  }, [activeTab]);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setAuthError("Please fill in all credential fields.");
      return;
    }

    setAuthError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      localStorage.setItem("horizon_admin_token", data.token);
      localStorage.setItem("horizon_admin_role", data.user.role);
      localStorage.setItem("horizon_admin_fullName", data.user.fullName);
      localStorage.setItem("horizon_admin_email", data.user.username);
      setToken(data.token);
      setUserRole(data.user.role);
      setUserFullName(data.user.fullName);
      setAdminEmail(data.user.username);
      showToast("Signed in as Administrator successfully.");
    } catch (err) {
      setAuthError((err as Error).message || "Invalid credentials.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setAuthError("Email address is required.");
      return;
    }

    setAuthError("");
    setIsSendingReset(true);
    setForgotSuccess("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setForgotSuccess(data.message || "If the account exists, password reset instructions have been sent.");
      setForgotEmail("");
    } catch (err) {
      setAuthError((err as Error).message || "An error occurred during your request.");
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPassword || !resetConfirmPassword) {
      setAuthError("Please fill in all password fields.");
      return;
    }
    if (resetPassword !== resetConfirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    // Client-side validation matching backend
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!strongPasswordRegex.test(resetPassword)) {
      setAuthError("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.");
      return;
    }

    setAuthError("");
    setIsResettingPassword(true);
    setResetSuccess("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: resetToken,
          password: resetPassword,
          confirmPassword: resetConfirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Reset password failed.");
      }

      setResetSuccess(data.message || "Your password has been reset successfully. Please log in again.");
      setResetPassword("");
      setResetConfirmPassword("");
      
      // Clean up search query param from URL
      window.history.replaceState({}, document.title, "/hlg-management-portal");
    } catch (err) {
      setAuthError((err as Error).message || "An error occurred while resetting your password.");
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("horizon_admin_token");
    localStorage.removeItem("horizon_admin_role");
    localStorage.removeItem("horizon_admin_fullName");
    setToken(null);
    setUserRole(null);
    setUserFullName("Administrator");
    setStats(null);
    setCustomers([]);
    setSelectedCustomer(null);
    setCustomerHistory(null);
    setAllBookings([]);
    setAllPartnerships([]);
    setAllAdmins([]);
    setIsSettingsVerified(false);
    showToast("Signed out of secure CRM session.");
  };

  const handleVerifySettingsPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsUnlockPassword) {
      setSettingsUnlockError("Password is required.");
      return;
    }
    setSettingsUnlockError("");
    setIsVerifyingSettingsPassword(true);
    try {
      const res = await fetch("/api/hlg-portal/admin/verify-settings-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: settingsUnlockPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Incorrect password.");
      }
      setIsSettingsVerified(true);
      setShowSettingsUnlockModal(false);
      setSettingsUnlockPassword("");
      setActiveTab("settings");
      setSelectedCustomer(null);
      showToast("Settings unlocked successfully.", "success");
    } catch (err) {
      setSettingsUnlockError((err as Error).message || "Incorrect password.");
    } finally {
      setIsVerifyingSettingsPassword(false);
    }
  };

  const handleRequestEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!changeEmailPassword) {
      showToast("Current password is required.", "error");
      return;
    }
    if (!changeEmailNewEmail.trim() || !changeEmailNewEmail.includes("@")) {
      showToast("Please enter a valid new email address.", "error");
      return;
    }

    setIsChangingEmail(true);
    setEmailChangeStatus(null);

    try {
      const res = await fetch("/api/hlg-portal/admin/request-email-change", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: changeEmailPassword,
          newEmail: changeEmailNewEmail.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setEmailChangeStatus({ text: data.message, type: "success" });
      setChangeEmailPassword("");
      setChangeEmailNewEmail("");
      showToast("Email change requested successfully.");
    } catch (err) {
      setEmailChangeStatus({ text: (err as Error).message, type: "error" });
      showToast((err as Error).message, "error");
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleConfirmEmailChange = async (tokenToConfirm?: string) => {
    if (!token) return;
    const finalToken = tokenToConfirm || pendingEmailChangeToken;
    if (!finalToken) {
      showToast("Verification token is missing.", "error");
      return;
    }

    setIsVerifyingEmailChange(true);
    setEmailChangeStatus(null);

    try {
      const res = await fetch("/api/hlg-portal/admin/confirm-email-change", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token: finalToken }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed.");
      }

      showToast("Primary email verified and updated successfully!", "success");
      
      // Clean up search query param from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("email_change_token");
      window.history.replaceState({}, document.title, url.toString());
      setPendingEmailChangeToken(null);

      // Force logout and prompt login with new credentials
      alert("Verification successful! All active JWT sessions have been invalidated. Please log in with your new email address.");
      handleLogout();
    } catch (err) {
      setEmailChangeStatus({ text: (err as Error).message, type: "error" });
      showToast((err as Error).message, "error");
    } finally {
      setIsVerifyingEmailChange(false);
    }
  };

  const fetchDashboardStats = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/hlg-portal/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format from server");
      }
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Dashboard metrics load failure:", err);
      showToast("Could not retrieve dashboard statistics.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomers = async (search = searchQuery, sort = sortBy) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      queryParams.append("sortBy", sort);

      const res = await fetch(`/api/hlg-portal/customers?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format from server");
      }
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("Customers list load failure:", err);
      showToast("Could not load customer profiles.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const selectCustomerProfile = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSubTab("profile");
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/hlg-portal/customers/${customer.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCustomerHistory({
        bookings: data.bookings,
        partnerships: data.partnerships,
      });
    } catch (err) {
      console.error("Customer details error:", err);
      showToast("Could not load customer details history.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking || !token) return;

    try {
      const res = await fetch(`/api/hlg-portal/bookings/${editingBooking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingBooking),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update booking.");

      showToast("Event booking details saved successfully.");
      
      // Refresh current context data
      if (selectedCustomer) {
        selectCustomerProfile(selectedCustomer);
      }
      fetchDashboardStats();
      if (activeTab === "bookings") {
        fetchAllBookings();
      }
      setEditingBooking(null);
    } catch (err) {
      showToast((err as Error).message, "error");
    }
  };

  const handleDeleteItem = async () => {
    if (!showDeleteConfirm) return;
    if (!token) {
      showToast("Session expired. Please log in again.", "error");
      handleLogout();
      setShowDeleteConfirm(null);
      return;
    }
    const { id, type } = showDeleteConfirm;

    try {
      if (type === "admin") {
        const res = await fetch(`/api/hlg-portal/admins/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          const contentType = res.headers.get("content-type");
          let errMsg = "Access denied. Only Super Admin can perform this action.";
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            errMsg = data.error || errMsg;
          }
          showToast(errMsg, "error");
          if (res.status === 401) {
            handleLogout();
          }
          setShowDeleteConfirm(null);
          return;
        }

        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format from server.");
        }

        const data = await res.json();
        showToast("Administrator deleted successfully.");
        setShowDeleteConfirm(null);
        fetchAllAdmins();
      } else {
        const url = type === "booking" ? `/api/hlg-portal/bookings/${id}` : `/api/hlg-portal/partnerships/${id}`;
        const res = await fetch(url, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          const contentType = res.headers.get("content-type");
          let errMsg = "Access denied or session expired.";
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            errMsg = data.error || errMsg;
          }
          showToast(errMsg, "error");
          if (res.status === 401) {
            handleLogout();
          }
          setShowDeleteConfirm(null);
          return;
        }

        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format from server.");
        }

        const data = await res.json();
        showToast(`${type === "booking" ? "Event booking" : "Partnership request"} record deleted.`);
        setShowDeleteConfirm(null);

        // Refresh records
        if (selectedCustomer) {
          selectCustomerProfile(selectedCustomer);
        }
        fetchDashboardStats();
        fetchCustomers();
        if (activeTab === "bookings") {
          fetchAllBookings();
        } else if (activeTab === "partnerships") {
          fetchAllPartnerships();
        }
      }
    } catch (err) {
      showToast((err as Error).message, "error");
    }
  };

  const fetchAllBookings = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/hlg-portal/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format from server");
      }
      const data = await res.json();
      setAllBookings(data);
    } catch (err) {
      console.error("Fetch all bookings failed:", err);
      showToast("Could not load bookings list.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllPartnerships = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/hlg-portal/partnerships", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format from server");
      }
      const data = await res.json();
      setAllPartnerships(data);
    } catch (err) {
      console.error("Fetch all partnerships failed:", err);
      showToast("Could not load partnerships list.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllAdmins = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/hlg-portal/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (res.status === 403) {
        return;
      }
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format from server");
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setAllAdmins(data);
      }
    } catch (err) {
      console.error("Fetch admins roster failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminPassword || !newAdminFullName.trim()) {
      setAdminSetupError("All fields are required.");
      return;
    }
    if (newAdminPassword.length < 6) {
      setAdminSetupError("Password must be at least 6 characters.");
      return;
    }
    setAdminSetupError("");
    setIsCreatingAdmin(true);
    try {
      const res = await fetch("/api/hlg-portal/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: newAdminEmail.trim(),
          password: newAdminPassword,
          fullName: newAdminFullName.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create administrator.");

      showToast("Secondary administrator created successfully.");
      setNewAdminEmail("");
      setNewAdminPassword("");
      setNewAdminFullName("");
      setShowAddAdminModal(false);
      fetchAllAdmins();
    } catch (err) {
      setAdminSetupError((err as Error).message);
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin || !token) return;

    setIsUpdatingAdmin(true);
    try {
      const res = await fetch(`/api/hlg-portal/admins/${editingAdmin.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: editAdminFullName.trim() || undefined,
          password: editAdminPassword || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update administrator.");

      showToast("Administrator profile settings saved.");
      setEditingAdmin(null);
      setEditAdminPassword("");
      setEditAdminFullName("");
      
      // If we updated ourselves, refresh the local displayed name!
      const currentEmail = localStorage.getItem("horizon_admin_email") || "";
      if (editingAdmin.username === currentEmail && editAdminFullName.trim()) {
        localStorage.setItem("horizon_admin_fullName", editAdminFullName.trim());
        setUserFullName(editAdminFullName.trim());
      }

      fetchAllAdmins();
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setIsUpdatingAdmin(false);
    }
  };

  const handleDeleteAdmin = (adminId: string, adminName: string) => {
    if (!token) return;
    setShowDeleteConfirm({
      id: adminId,
      type: "admin",
      adminName: adminName,
    });
  };

  // Quick helper to match status colors
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "Confirmed":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "Completed":
        return "bg-sky-500/10 text-sky-400 border border-sky-500/20";
      case "Cancelled":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  // If not logged in, render the secure admin setup or login form
  if (!token) {
    if (setupExists === null) {
      return (
        <div className="min-h-screen bg-[#041910] text-[#f4edd9] flex items-center justify-center p-6" id="admin-loading-layout">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="h-8 w-8 text-[#c09f53] animate-spin" />
            <p className="font-mono text-xs text-[#c09f53]/80 uppercase tracking-widest">Checking Setup Status...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#041910] text-[#f4edd9] flex items-center justify-center p-6 relative overflow-hidden" id="admin-login-layout">
        {/* Glow elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c09f53]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-[#0d3b0d]/80 border border-[#c09f53]/25 p-8 rounded-sm shadow-2xl relative z-10"
        >
          {/* Logo */}
          <div className="text-center mb-6">
            <img src="/logo.png" alt="Logo" className="h-12 w-auto mx-auto mb-4" />
            <h2 className="font-serif text-2xl tracking-[0.1em] uppercase text-[#f4edd9]">
              Horizon Secure CRM
            </h2>
            <p className="font-sans text-xs text-[#c09f53] tracking-widest uppercase mt-1">
              {setupExists ? "ADMINISTRATIVE CONTROL PORTAL" : "ONE-TIME ADMIN SETUP"}
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3.5 bg-rose-950/40 border border-rose-800 text-rose-200 text-xs font-sans rounded-sm text-center">
              {authError}
            </div>
          )}

          {!setupExists ? (
            // ONE-TIME SETUP FORM
            <form onSubmit={handleSetup} className="space-y-5" id="setup-form">
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-sm mb-2 text-center">
                <p className="text-xs text-amber-300 font-sans leading-relaxed">
                  <strong>Database is empty.</strong> Set up your primary administrator credentials below. 
                  Once configured, public sign-ups are permanently locked.
                </p>
              </div>

              <div>
                <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                  FULL NAME
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={setupFullName}
                  onChange={(e) => setSetupFullName(e.target.value)}
                  required
                  className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-4 py-3 rounded-sm font-sans text-sm focus:outline-none focus:border-[#c09f53]"
                />
              </div>

              <div>
                <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  placeholder="admin@horizon.com"
                  value={setupEmail}
                  onChange={(e) => setSetupEmail(e.target.value)}
                  required
                  className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-4 py-3 rounded-sm font-sans text-sm focus:outline-none focus:border-[#c09f53]"
                />
              </div>

              <div>
                <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                  CHOOSE SECURE PASSWORD
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={setupPassword}
                  onChange={(e) => setSetupPassword(e.target.value)}
                  required
                  className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-4 py-3 rounded-sm font-sans text-sm focus:outline-none focus:border-[#c09f53]"
                />
              </div>

              <button
                type="submit"
                disabled={isSettingUp}
                className="w-full py-3.5 bg-[#c09f53] text-[#0d3b0d] font-sans text-xs tracking-widest uppercase hover:bg-[#aa863e] transition-colors font-bold rounded-sm shadow-lg cursor-pointer disabled:opacity-50"
              >
                {isSettingUp ? "CREATING ADMIN..." : "CREATE MASTER ADMIN"}
              </button>
            </form>
          ) : authView === "login" ? (
            // SECURE LOGIN FORM
            <form onSubmit={handleLogin} className="space-y-6" id="login-form">
              <div>
                <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-2">
                  ADMIN EMAIL / USERNAME
                </label>
                <input
                  type="text"
                  placeholder="admin@horizon.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-4 py-3.5 rounded-sm font-sans text-sm focus:outline-none focus:border-[#c09f53]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block">
                    PASSWORD
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthView("forgot");
                      setAuthError("");
                      setForgotSuccess("");
                    }}
                    className="font-mono text-[9px] text-[#c09f53] hover:text-[#aa863e] tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-4 py-3.5 rounded-sm font-sans text-sm focus:outline-none focus:border-[#c09f53]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-4 bg-[#c09f53] text-[#0d3b0d] font-sans text-xs tracking-widest uppercase hover:bg-[#aa863e] transition-colors font-bold rounded-sm shadow-lg cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? "VERIFYING..." : "ENTER CONTROL PANEL"}
              </button>
            </form>
          ) : authView === "forgot" ? (
            // FORGOT PASSWORD FORM
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-6" id="forgot-form">
              <div className="p-3.5 bg-[#c09f53]/10 border border-[#c09f53]/25 rounded-sm text-center">
                <p className="text-xs text-[#e5d7af] font-sans leading-relaxed">
                  Enter your registered administrator email address. If verified, we will generate a secure one-time reset link.
                </p>
              </div>

              {forgotSuccess && (
                <div className="p-3.5 bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs font-sans rounded-sm text-center">
                  {forgotSuccess}
                </div>
              )}

              <div>
                <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-2">
                  REGISTERED ADMIN EMAIL
                </label>
                <input
                  type="email"
                  placeholder="admin@horizon.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  disabled={isSendingReset}
                  className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-4 py-3.5 rounded-sm font-sans text-sm focus:outline-none focus:border-[#c09f53] disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={isSendingReset}
                className="w-full py-4 bg-[#c09f53] text-[#0d3b0d] font-sans text-xs tracking-widest uppercase hover:bg-[#aa863e] transition-colors font-bold rounded-sm shadow-lg cursor-pointer disabled:opacity-50"
              >
                {isSendingReset ? "SENDING INSTRUCTIONS..." : "REQUEST RESET LINK"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthView("login");
                    setAuthError("");
                    setForgotSuccess("");
                  }}
                  className="font-mono text-[10px] text-[#c09f53] hover:text-[#aa863e] tracking-widest uppercase transition-colors cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            // RESET PASSWORD FORM
            <form onSubmit={handleResetPasswordSubmit} className="space-y-5" id="reset-form">
              <div className="p-3.5 bg-[#c09f53]/10 border border-[#c09f53]/25 rounded-sm">
                <p className="text-xs text-[#e5d7af] font-sans leading-relaxed text-center font-semibold">
                  CHOOSE NEW CRITICAL ACCESS PASSWORD
                </p>
                <div className="mt-2 text-[10px] text-[#e5d7af]/70 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 size={10} className="text-[#c09f53]" /> Minimum 8 characters in length
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 size={10} className="text-[#c09f53]" /> At least one uppercase & lowercase letter
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 size={10} className="text-[#c09f53]" /> At least one number & special character
                  </p>
                </div>
              </div>

              {resetSuccess && (
                <div className="p-3.5 bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs font-sans rounded-sm text-center">
                  {resetSuccess}
                </div>
              )}

              {!resetSuccess && (
                <>
                  <div>
                    <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-2">
                      NEW PASSWORD
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      required
                      disabled={isResettingPassword}
                      className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-4 py-3.5 rounded-sm font-sans text-sm focus:outline-none focus:border-[#c09f53] disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-2">
                      CONFIRM NEW PASSWORD
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                      required
                      disabled={isResettingPassword}
                      className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-4 py-3.5 rounded-sm font-sans text-sm focus:outline-none focus:border-[#c09f53] disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isResettingPassword}
                    className="w-full py-4 bg-[#c09f53] text-[#0d3b0d] font-sans text-xs tracking-widest uppercase hover:bg-[#aa863e] transition-colors font-bold rounded-sm shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {isResettingPassword ? "RESETTING PASSWORD..." : "SAVE NEW PASSWORD"}
                  </button>
                </>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthView("login");
                    setAuthError("");
                    setResetSuccess("");
                  }}
                  className="font-mono text-[10px] text-[#c09f53] hover:text-[#aa863e] tracking-widest uppercase transition-colors cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}


        </motion.div>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // Client-side computations (Filtering, Sorting, and Pagination)
  // -------------------------------------------------------------------

  // 1. Customers Pagination
  const CUSTOMERS_PER_PAGE = 10;
  const customersTotalPages = Math.max(1, Math.ceil(customers.length / CUSTOMERS_PER_PAGE));
  const paginatedCustomers = customers.slice(
    (customersPage - 1) * CUSTOMERS_PER_PAGE,
    customersPage * CUSTOMERS_PER_PAGE
  );

  // 2. Bookings Filter, Sort, and Pagination
  const filteredBookings = allBookings.filter((booking) => {
    // Status filter
    if (bookingsStatusFilter !== "All" && booking.bookingStatus !== bookingsStatusFilter) {
      return false;
    }
    // Search filter
    if (bookingsSearch.trim() !== "") {
      const s = bookingsSearch.toLowerCase();
      const matchName = booking.customerName?.toLowerCase().includes(s);
      const matchEmail = booking.customerEmail?.toLowerCase().includes(s);
      const matchType = booking.eventType?.toLowerCase().includes(s);
      const matchVenue = booking.venue?.toLowerCase().includes(s);
      const matchDate = booking.eventDate?.toLowerCase().includes(s);
      return matchName || matchEmail || matchType || matchVenue || matchDate;
    }
    return true;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (bookingsSortBy === "newest") {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
    if (bookingsSortBy === "oldest") {
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    }
    if (bookingsSortBy === "event_date") {
      return new Date(a.eventDate || 0).getTime() - new Date(b.eventDate || 0).getTime();
    }
    if (bookingsSortBy === "guests_high") {
      return Number(b.guestCount || 0) - Number(a.guestCount || 0);
    }
    if (bookingsSortBy === "guests_low") {
      return Number(a.guestCount || 0) - Number(b.guestCount || 0);
    }
    return 0;
  });

  const BOOKINGS_PER_PAGE = 10;
  const bookingsTotalPages = Math.max(1, Math.ceil(sortedBookings.length / BOOKINGS_PER_PAGE));
  const paginatedBookings = sortedBookings.slice(
    (bookingsPage - 1) * BOOKINGS_PER_PAGE,
    bookingsPage * BOOKINGS_PER_PAGE
  );

  // 3. Partnerships Filter, Sort, and Pagination
  const filteredPartnerships = allPartnerships.filter((p) => {
    // Model filter
    if (partnershipsModelFilter !== "All" && p.partnershipModel !== partnershipsModelFilter) {
      return false;
    }
    // City filter
    if (partnershipsCityFilter !== "All" && p.city !== partnershipsCityFilter) {
      return false;
    }
    // Search filter
    if (partnershipsSearch.trim() !== "") {
      const s = partnershipsSearch.toLowerCase();
      const matchClub = p.clubName?.toLowerCase().includes(s);
      const matchName = p.fullName?.toLowerCase().includes(s);
      const matchWhatsApp = p.whatsappNumber?.toLowerCase().includes(s);
      const matchCity = p.city?.toLowerCase().includes(s);
      const matchMessage = p.message?.toLowerCase().includes(s);
      return matchClub || matchName || matchWhatsApp || matchCity || matchMessage;
    }
    return true;
  });

  const sortedPartnerships = [...filteredPartnerships].sort((a, b) => {
    if (partnershipsSortBy === "newest") {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
    if (partnershipsSortBy === "oldest") {
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    }
    if (partnershipsSortBy === "city_asc") {
      return (a.city || "").localeCompare(b.city || "");
    }
    return 0;
  });

  const PARTNERSHIPS_PER_PAGE = 10;
  const partnershipsTotalPages = Math.max(1, Math.ceil(sortedPartnerships.length / PARTNERSHIPS_PER_PAGE));
  const paginatedPartnerships = sortedPartnerships.slice(
    (partnershipsPage - 1) * PARTNERSHIPS_PER_PAGE,
    partnershipsPage * PARTNERSHIPS_PER_PAGE
  );

  // 4. Unique Cities Extraction
  const uniqueCities = Array.from(
    new Set(allPartnerships.map((p) => p.city).filter((city): city is string => !!city))
  ).sort();

  const newUsersCount = customers.filter((c) => {
    if (!c.createdAt) return false;
    const createdDate = new Date(c.createdAt);
    const diffMs = Date.now() - createdDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  }).length;

  return (
    <div className="min-h-screen bg-[#041910] text-[#f4edd9] font-sans pb-16" id="admin-crm-workspace">
      {/* 1. Unified CRM Header & Navigation */}
      <header className="bg-[#0d3b0d] border-b border-[#c09f53]/20 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <div>
              <h2 className="font-serif text-[#f4edd9] text-base tracking-[0.15em] uppercase leading-none">
                Horizon CRM
              </h2>
              <p className="font-mono text-[8px] text-[#c09f53] tracking-widest uppercase mt-0.5">
                Excellence Leisure Management
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-1 flex-wrap">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setSelectedCustomer(null);
              }}
              className={`px-3 py-1.5 text-xs font-mono tracking-widest uppercase transition-colors rounded-sm cursor-pointer ${
                activeTab === "dashboard" && !selectedCustomer
                  ? "bg-[#c09f53] text-[#0d3b0d] font-semibold"
                  : "text-[#e5d7af]/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab("customers");
                setSelectedCustomer(null);
              }}
              className={`px-3 py-1.5 text-xs font-mono tracking-widest uppercase transition-colors rounded-sm cursor-pointer ${
                (activeTab === "customers" || selectedCustomer)
                  ? "bg-[#c09f53] text-[#0d3b0d] font-semibold"
                  : "text-[#e5d7af]/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => {
                setActiveTab("bookings");
                setSelectedCustomer(null);
              }}
              className={`px-3 py-1.5 text-xs font-mono tracking-widest uppercase transition-colors rounded-sm cursor-pointer ${
                activeTab === "bookings"
                  ? "bg-[#c09f53] text-[#0d3b0d] font-semibold"
                  : "text-[#e5d7af]/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => {
                setActiveTab("partnerships");
                setSelectedCustomer(null);
              }}
              className={`px-3 py-1.5 text-xs font-mono tracking-widest uppercase transition-colors rounded-sm cursor-pointer ${
                activeTab === "partnerships"
                  ? "bg-[#c09f53] text-[#0d3b0d] font-semibold"
                  : "text-[#e5d7af]/70 hover:text-white hover:bg-white/5"
              }`}
            >
              Contacts
            </button>
            {userRole === "super_admin" && (
              <button
                onClick={() => {
                  if (isSettingsVerified) {
                    setActiveTab("settings");
                    setSelectedCustomer(null);
                  } else {
                    setSettingsUnlockPassword("");
                    setSettingsUnlockError("");
                    setShowSettingsUnlockModal(true);
                  }
                }}
                className={`px-3 py-1.5 text-xs font-mono tracking-widest uppercase transition-colors rounded-sm cursor-pointer ${
                  (activeTab === "settings" || activeTab === "account_settings" || activeTab === "users")
                    ? "bg-[#c09f53] text-[#0d3b0d] font-semibold"
                    : "text-[#e5d7af]/70 hover:text-white hover:bg-white/5"
                }`}
              >
                Settings
              </button>
            )}
            
            <span className="h-4 w-px bg-white/10 mx-2 hidden sm:inline"></span>
            
            <button
              onClick={() => {
                fetchDashboardStats();
                fetchCustomers();
                showToast("Data refreshed successfully.");
              }}
              title="Refresh data"
              className="p-2 text-[#e5d7af]/70 hover:text-white rounded-sm hover:bg-white/5 transition-colors cursor-pointer"
            >
              <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            </button>
            
            <button
              onClick={handleLogout}
              className="ml-1 px-3 py-1.5 text-xs font-mono tracking-widest uppercase text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors rounded-sm cursor-pointer"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 mt-10">

          {selectedCustomer && (
            <div className="px-5 py-3 font-sans text-xs tracking-widest uppercase font-semibold text-[#c09f53] border-b-2 border-[#c09f53] flex items-center gap-1.5 bg-[#c09f53]/5">
              <ChevronRight size={12} className="text-[#c09f53]/50" /> Customer: {selectedCustomer.name}
            </div>
          )}

        {/* Verification banner for pending email change */}
        {pendingEmailChangeToken && (
          <div className="bg-[#c09f53]/10 border border-[#c09f53]/30 p-4 rounded-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <h5 className="font-serif text-[#f4edd9] font-medium text-sm flex items-center gap-1.5">
                <Shield size={14} className="text-[#c09f53]" /> Secure Email Verification Link Detected
              </h5>
              <p className="font-sans text-xs text-[#e5d7af]/80 font-light mt-0.5">
                Click the button to finalize your primary email change request and invalidate all active sessions.
              </p>
            </div>
            <button
              onClick={() => handleConfirmEmailChange()}
              disabled={isVerifyingEmailChange}
              className="px-4 py-2 bg-[#c09f53] text-[#0d3b0d] font-mono text-[10px] tracking-widest uppercase font-bold rounded-sm shadow hover:bg-[#aa863e] transition-colors cursor-pointer"
            >
              {isVerifyingEmailChange ? "Verifying..." : "Confirm Email Change"}
            </button>
          </div>
        )}

        {/* -------------------------------------------------------------------
            VIEW A: CUSTOMER PROFILE SYSTEM (Details screen takes precedence)
            ------------------------------------------------------------------- */}
        {selectedCustomer ? (
          <div className="space-y-8" id="customer-profile-screen">
            {/* Back to list bar */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="flex items-center gap-1.5 text-xs text-[#c09f53] hover:text-[#f4edd9] transition-colors uppercase font-mono tracking-wider cursor-pointer"
              >
                ← Return to {activeTab === "dashboard" ? "Dashboard" : "Customer Profiles List"}
              </button>
            </div>

            {/* Profile Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* SECTION 1: PROFILE SUMMARY CARD */}
              <div className="lg:col-span-4 bg-[#0d3b0d]/60 border border-[#c09f53]/25 p-6 rounded-sm space-y-6">
                <div className="text-center pb-6 border-b border-white/5">
                  <div className="w-16 h-16 bg-[#c09f53]/10 border border-[#c09f53]/30 text-[#c09f53] rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={32} />
                  </div>
                  <h3 className="font-serif text-2xl text-white font-medium">{selectedCustomer.name}</h3>
                  <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-sm uppercase mt-2 inline-block">
                    PERMANENT PROFILE
                  </span>
                </div>

                <div className="space-y-4 text-sm font-sans">
                  <div>
                    <span className="font-mono text-[8px] text-[#c09f53] tracking-widest uppercase block mb-1">Email Address</span>
                    <a href={`mailto:${selectedCustomer.email}`} className="text-white hover:text-[#c09f53] transition-colors font-medium break-all flex items-center gap-1.5">
                      <Mail size={12} className="opacity-60" /> {selectedCustomer.email}
                    </a>
                  </div>

                  <div>
                    <span className="font-mono text-[8px] text-[#c09f53] tracking-widest uppercase block mb-1">Phone / WhatsApp</span>
                    <a href={`tel:${selectedCustomer.phone}`} className="text-white hover:text-[#c09f53] transition-colors font-medium flex items-center gap-1.5">
                      <Phone size={12} className="opacity-60" /> {selectedCustomer.phone}
                    </a>
                  </div>

                  <div>
                    <span className="font-mono text-[8px] text-[#c09f53] tracking-widest uppercase block mb-1">Customer Since</span>
                    <span className="text-white font-medium flex items-center gap-1.5">
                      <CalendarDays size={12} className="opacity-60" /> {new Date(selectedCustomer.createdAt).toLocaleDateString("en-PK", { dateStyle: "long" })}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono text-[8px] text-[#c09f53] tracking-widest uppercase block mb-1">Last CRM Activity</span>
                    <span className="text-white font-medium flex items-center gap-1.5">
                      <Clock size={12} className="opacity-60" /> {new Date(selectedCustomer.lastActivity).toLocaleDateString("en-PK", { dateStyle: "long" })} {new Date(selectedCustomer.lastActivity).toLocaleTimeString("en-PK", { timeStyle: "short" })}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                  <div className="bg-[#0a2e0a] p-3 rounded-sm border border-white/5 text-center">
                    <span className="font-mono text-[8px] text-[#e5d7af]/55 uppercase tracking-wider block mb-1">Bookings</span>
                    <span className="text-lg font-serif text-[#c09f53] font-bold">{selectedCustomer.totalBookings}</span>
                  </div>
                  <div className="bg-[#0a2e0a] p-3 rounded-sm border border-white/5 text-center">
                    <span className="font-mono text-[8px] text-[#e5d7af]/55 uppercase tracking-wider block mb-1">Partnerships</span>
                    <span className="text-lg font-serif text-[#c09f53] font-bold">{selectedCustomer.totalPartnershipRequests}</span>
                  </div>
                </div>
              </div>

              {/* CRM TABS WRAPPER (Booking History & Partnership Requests) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Switcher */}
                <div className="flex gap-2 border-b border-white/5">
       
                  <button
                    onClick={() => setCustomerSubTab("bookings")}
                    className={`px-4 py-2 text-xs font-mono tracking-wider uppercase border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                      customerSubTab === "bookings" ? "border-[#c09f53] text-[#c09f53]" : "border-transparent text-[#e5d7af]/50"
                    }`}
                  >
                    Booking History ({customerHistory?.bookings.length || 0})
                  </button>
                  <button
                    onClick={() => setCustomerSubTab("partnerships")}
                    className={`px-4 py-2 text-xs font-mono tracking-wider uppercase border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                      customerSubTab === "partnerships" ? "border-[#c09f53] text-[#c09f53]" : "border-transparent text-[#e5d7af]/50"
                    }`}
                  >
                    Partnership Requests ({customerHistory?.partnerships.length || 0})
                  </button>
                </div>

                {/* Sub Tab Contents */}
                <div className="min-h-[300px]">
                  
                  {/* SUB TAB 1: QUICK CONTEXT */}
                  {customerSubTab === "profile" && (
                    <div className="space-y-6">
                      <div className="bg-[#0d3b0d]/30 border border-white/5 p-6 rounded-sm">
                       
                      </div>

                    </div>
                  )}

                  {/* SUB TAB 2: BOOKINGS LIST */}
                  {customerSubTab === "bookings" && (
                    <div className="space-y-4">
                      {(!customerHistory || customerHistory.bookings.length === 0) ? (
                        <div className="text-center py-12 border border-dashed border-white/10 text-[#e5d7af]/40 font-mono text-xs uppercase">
                          No event booking submissions have been recorded for this profile.
                        </div>
                      ) : (
                        customerHistory.bookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="bg-[#0d3b0d]/35 border border-white/5 p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <span className="font-serif text-lg text-white font-medium">{booking.eventType} Event</span>
                                <span className={`px-2 py-0.5 text-[9px] font-mono rounded-sm uppercase tracking-wider ${getStatusBadgeClass(booking.bookingStatus)}`}>
                                  {booking.bookingStatus}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1.5 text-xs font-sans text-[#e5d7af]/75">
                                <div>
                                  <span className="text-[#c09f53]/70 font-mono text-[9px] tracking-wider uppercase block">Preferred Date</span>
                                  <strong className="text-white font-medium">{booking.eventDate}</strong>
                                </div>
                                <div>
                                  <span className="text-[#c09f53]/70 font-mono text-[9px] tracking-wider uppercase block">Guest Count</span>
                                  <strong className="text-white font-medium">{booking.guestCount}</strong>
                                </div>
                                <div>
                                  <span className="text-[#c09f53]/70 font-mono text-[9px] tracking-wider uppercase block">Preferred Venue</span>
                                  <strong className="text-white font-medium">{booking.venue}</strong>
                                </div>
                                <div>
                                  <span className="text-[#c09f53]/70 font-mono text-[9px] tracking-wider uppercase block">Created Date</span>
                                  <span className="font-light">{new Date(booking.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>

                              {booking.notes && (
                                <div className="bg-[#0a2e0a]/40 border border-white/5 px-3.5 py-2.5 rounded-sm text-xs font-sans text-[#e5d7af]/80 italic mt-2">
                                  "{booking.notes}"
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2 justify-end shrink-0">
                              <button
                                onClick={() => setEditingBooking(booking)}
                                className="p-2 border border-white/10 hover:border-[#c09f53]/40 text-[#e5d7af] hover:text-[#c09f53] transition-colors rounded-sm cursor-pointer"
                                title="Edit booking details"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm({ id: booking.id, type: "booking" })}
                                className="p-2 border border-rose-950/40 hover:border-rose-500/30 text-rose-300 hover:bg-rose-950/20 transition-colors rounded-sm cursor-pointer"
                                title="Delete booking record"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* SUB TAB 3: PARTNERSHIPS */}
                  {customerSubTab === "partnerships" && (
                    <div className="space-y-4">
                      {(!customerHistory || customerHistory.partnerships.length === 0) ? (
                        <div className="text-center py-12 border border-dashed border-white/10 text-[#e5d7af]/40 font-mono text-xs uppercase">
                          No partnership consultation proposals found for this customer profile.
                        </div>
                      ) : (
                        customerHistory.partnerships.map((partnership) => (
                          <div
                            key={partnership.id}
                            className="bg-[#0d3b0d]/35 border border-white/5 p-6 rounded-sm flex flex-col md:flex-row md:items-start justify-between gap-6"
                          >
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h4 className="font-serif text-lg text-[#f4edd9] font-medium">{partnership.clubName}</h4>
                                <span className="font-mono text-[9px] bg-[#c09f53]/15 text-[#c09f53] border border-[#c09f53]/20 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                                  {partnership.partnershipModel}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1.5 text-xs font-sans text-[#e5d7af]/75">
                                <div>
                                  <span className="text-[#c09f53]/70 font-mono text-[9px] tracking-wider uppercase block">Submitted By</span>
                                  <strong className="text-white font-medium">{partnership.fullName}</strong>
                                </div>
                                <div>
                                  <span className="text-[#c09f53]/70 font-mono text-[9px] tracking-wider uppercase block">WhatsApp Contact</span>
                                  <a href={`https://wa.me/${partnership.whatsappNumber.replace(/[\s+]/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-medium hover:underline">
                                    {partnership.whatsappNumber}
                                  </a>
                                </div>
                                <div>
                                  <span className="text-[#c09f53]/70 font-mono text-[9px] tracking-wider uppercase block">Target City</span>
                                  <strong className="text-white font-medium">{partnership.city}</strong>
                                </div>
                                <div>
                                  <span className="text-[#c09f53]/70 font-mono text-[9px] tracking-wider uppercase block">Submitted Date</span>
                                  <span className="font-light">{new Date(partnership.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>

                              {partnership.message && (
                                <div className="bg-[#0a2e0a]/40 border border-white/5 p-3.5 rounded-sm text-xs font-sans text-[#e5d7af]/80 leading-relaxed block whitespace-pre-wrap">
                                  <strong>Facility & Goals Description:</strong>
                                  <p className="mt-1 font-light italic font-serif">"{partnership.message}"</p>
                                </div>
                              )}
                            </div>

                            <div className="shrink-0 flex justify-end">
                              <button
                                onClick={() => setShowDeleteConfirm({ id: partnership.id, type: "partnership" })}
                                className="p-2 border border-rose-950/40 hover:border-rose-500/30 text-rose-300 hover:bg-rose-950/20 transition-colors rounded-sm cursor-pointer"
                                title="Delete partnership request"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                </div>

              </div>

            </div>
          </div>
        ) : (
          <>
            {/* -------------------------------------------------------------------
                VIEW B: SECURE MAIN METRICS DASHBOARD VIEW
                ------------------------------------------------------------------- */}
            {activeTab === "dashboard" && (
              <div className="space-y-8" id="dashboard-tab-view">
                
                {/* 1. Metrics Bento Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Card 1: Total Profiles */}
                  <div className="bg-[#0d3b0d]/50 border border-white/5 p-6 rounded-sm relative overflow-hidden">
                    <div className="absolute right-4 bottom-4 text-white/5"><Users size={80} /></div>
                    <span className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-2">Total Customers</span>
                    <h3 className="font-serif text-3xl text-white font-medium">{stats?.totalCustomers ?? "-"}</h3>
                    <p className="font-sans text-[11px] text-[#e5d7af]/50 mt-1 font-light"> user identities</p>
                  </div>

                  {/* Card 2: Total Event Bookings */}
                  <div className="bg-[#0d3b0d]/50 border border-white/5 p-6 rounded-sm relative overflow-hidden">
                    <div className="absolute right-4 bottom-4 text-white/5"><Calendar size={80} /></div>
                    <span className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-2">Total Bookings</span>
                    <h3 className="font-serif text-3xl text-white font-medium">{stats?.totalBookings ?? "-"}</h3>
                    <p className="font-sans text-[11px] text-[#e5d7af]/50 mt-1 font-light flex items-center gap-1">
                      <Clock size={10} className="text-amber-400" /> {stats?.pendingBookings ?? 0} Pending approvals
                    </p>
                  </div>

                  {/* Card 3: Total Partnerships */}
                  <div className="bg-[#0d3b0d]/50 border border-white/5 p-6 rounded-sm relative overflow-hidden">
                    <div className="absolute right-4 bottom-4 text-white/5"><Handshake size={80} /></div>
                    <span className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-2">Partnership Requests</span>
                    <h3 className="font-serif text-3xl text-white font-medium">{stats?.totalPartnershipRequests ?? "-"}</h3>
                    <p className="font-sans text-[11px] text-[#e5d7af]/50 mt-1 font-light">Complimentary consultations</p>
                  </div>

                  {/* Card 4: Booking Completion */}
                  <div className="bg-[#0d3b0d]/50 border border-white/5 p-6 rounded-sm relative overflow-hidden">
                    <div className="absolute right-4 bottom-4 text-white/5"><CheckCircle2 size={80} /></div>
                    <span className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-2">Completed Events</span>
                    <h3 className="font-serif text-3xl text-white font-medium">{stats?.completedBookings ?? "-"}</h3>
                    <p className="font-sans text-[11px] text-[#e5d7af]/50 mt-1 font-light">Orchestrated with excellence</p>
                  </div>

                </div>

                {/* 2. Upcoming Events & General Quick-Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Bento: Upcoming Event Agenda (5 closest dates) */}
                  <div className="lg:col-span-8 bg-[#0d3b0d]/30 border border-white/5 p-6 rounded-sm space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <div>
                        <h4 className="font-serif text-lg text-white font-medium">Upcoming Events Agenda</h4>
                        <p className="font-sans text-xs text-[#e5d7af]/60 font-light">Active and confirmed bookings scheduled closest to current date</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {(!stats || stats.upcomingEvents.length === 0) ? (
                        <div className="text-center py-12 text-[#e5d7af]/40 font-mono text-xs uppercase border border-dashed border-white/5 rounded-sm bg-[#0a2e0a]/20">
                          No upcoming events scheduled currently.
                        </div>
                      ) : (
                        stats.upcomingEvents.map((event) => (
                          <div
                            key={event.id}
                            className="bg-[#0a2e0a]/45 border border-white/5 p-4 rounded-sm flex items-center justify-between gap-4 flex-wrap"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-serif text-sm text-white font-medium">{event.eventType} Event</span>
                                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-sm uppercase ${getStatusBadgeClass(event.bookingStatus)}`}>
                                  {event.bookingStatus}
                                </span>
                              </div>
                              <p className="font-sans text-xs text-[#e5d7af]/70">
                                Customer: <strong className="text-white">{event.customerName}</strong> • Venue: <strong className="text-white">{event.venue}</strong> • Guests: {event.guestCount}
                              </p>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right font-mono text-xs">
                                <span className="text-[#c09f53] font-bold block">{event.eventDate}</span>
                                <span className="text-[9px] text-[#e5d7af]/50 block">Target Date</span>
                              </div>
                              {/* Quick link button to customer context profile */}
                              <button
                                onClick={() => {
                                  // Find customer document
                                  const custObj = customers.find((c) => c.id === event.customerId) || {
                                    id: event.customerId,
                                    name: event.customerName || "Unknown",
                                    email: event.customerEmail || "Unknown",
                                    phone: event.customerPhone || "Unknown",
                                    createdAt: "",
                                    lastActivity: "",
                                    totalBookings: 0,
                                    totalPartnershipRequests: 0,
                                  };
                                  selectCustomerProfile(custObj as Customer);
                                }}
                                className="p-1.5 border border-[#c09f53]/25 hover:border-[#c09f53] text-[#c09f53] hover:text-white rounded-sm transition-colors cursor-pointer"
                                title="Open customer context profile"
                              >
                                <ChevronRight size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right Bento: Help instructions or info context */}
                  <div className="lg:col-span-4 bg-[#0d3b0d]/40 border border-[#c09f53]/15 p-6 rounded-sm space-y-6">
                    <h4 className="font-serif text-lg text-[#f4edd9] border-b border-white/5 pb-2">Admin Quick Operations</h4>
                    
                    <div className="space-y-4 font-sans text-xs text-[#e5d7af]/80 leading-relaxed font-light">
                      {/* <p>
                        All user interaction logs on this platform are fully synchronized. When a user submits an event inquiry or partnership proposal, the system cross-references active records using email or phone.
                      </p>
                       */}
                      <div className="bg-[#0a2e0a]/40 border border-white/5 p-4 rounded-sm space-y-2.5">
                        <span className="font-mono text-[9px] tracking-wider text-[#c09f53] font-bold block uppercase">ADMIN QUICK ACTIONS</span>
                        <button
                          onClick={() => {
                            setActiveTab("customers");
                            setSearchQuery("");
                            fetchCustomers("", "active");
                          }}
                          className="w-full text-left py-2 px-2.5 bg-[#0d3b0d] hover:bg-[#c09f53]/10 border border-white/10 rounded-sm text-white font-mono uppercase tracking-wider flex justify-between items-center transition-colors cursor-pointer"
                        >
                          Show Active Users <ChevronRight size={11} className="text-[#c09f53]" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab("customers");
                            setSearchQuery("");
                            fetchCustomers("", "newest");
                          }}
                          className="w-full text-left py-2 px-2.5 bg-[#0d3b0d] hover:bg-[#c09f53]/10 border border-white/10 rounded-sm text-white font-mono uppercase tracking-wider flex justify-between items-center transition-colors cursor-pointer"
                        >
                          Show All Profiles <ChevronRight size={11} className="text-[#c09f53]" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* -------------------------------------------------------------------
                VIEW C: CUSTOMER LISTS & SEARCH SCREEN
                ------------------------------------------------------------------- */}
            {activeTab === "customers" && (
              <div className="space-y-6" id="customers-tab-view">
                
                {/* Search & Sort controllers */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch bg-[#0d3b0d]/20 border border-white/5 p-4 rounded-sm">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#c09f53]/60 pointer-events-none">
                      <Search size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search customer records by Name, Email, or Phone..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCustomersPage(1);
                        fetchCustomers(e.target.value, sortBy);
                      }}
                      className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white pl-10 pr-4 py-2.5 rounded-sm text-xs font-sans focus:outline-none focus:border-[#c09f53]"
                    />
                  </div>

                  <div className="flex gap-2 items-center">
                    <span className="font-mono text-[9px] text-[#e5d7af]/55 uppercase tracking-widest flex items-center gap-1 shrink-0">
                      <ArrowUpDown size={11} /> SORT BY:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setCustomersPage(1);
                        fetchCustomers(searchQuery, e.target.value);
                      }}
                      className="bg-[#0a2e0a] border border-[#c09f53]/25 text-[#f4edd9] py-2 px-3 text-xs rounded-sm focus:outline-none font-sans"
                    >
                      <option value="newest">Newest Profiles</option>
                      <option value="oldest">Oldest Profiles</option>
                      <option value="active">Most Active Profiles</option>
                    </select>
                  </div>
                </div>

                {/* Customers Table / Cards */}
                <div className="bg-[#0d3b0d]/10 border border-white/5 rounded-sm overflow-hidden shadow-xl">
                  {customers.length === 0 ? (
                    <div className="text-center py-24 text-[#e5d7af]/40 font-mono text-xs uppercase">
                      No matching customer profiles could be located.
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-sans">
                          <thead className="bg-[#0d3b0d]/50 font-mono text-[10px] text-[#c09f53] tracking-widest uppercase border-b border-white/5">
                            <tr>
                              <th className="py-4 px-6 font-semibold">CUSTOMER</th>
                              <th className="py-4 px-6 font-semibold">CONTACT CHANNELS</th>
                              <th className="py-4 px-6 font-semibold text-center">BOOKINGS</th>
                              <th className="py-4 px-6 font-semibold text-center">PARTNERSHIPS</th>
                              <th className="py-4 px-6 font-semibold text-right">LAST ACTIVITY</th>
                              <th className="py-4 px-6 text-right">ACTION</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-white/80 font-light">
                            {paginatedCustomers.map((customer) => (
                              <tr key={customer.id} className="hover:bg-[#0d3b0d]/20 transition-colors">
                                <td className="py-4 px-6">
                                  <div className="font-serif text-sm text-white font-medium">{customer.name}</div>
                                  <span className="text-[9px] font-mono text-[#e5d7af]/50 block mt-0.5">ID: {customer.id}</span>
                                </td>
                                <td className="py-4 px-6 space-y-1 font-mono text-[11px]">
                                  <div className="text-white/90">{customer.email}</div>
                                  <div className="text-[#c09f53]/90">{customer.phone}</div>
                                </td>
                                <td className="py-4 px-6 text-center">
                                  <span className="font-serif text-sm font-bold text-white bg-white/5 border border-white/5 px-2.5 py-1 rounded-sm">
                                    {customer.totalBookings}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                  <span className="font-serif text-sm font-bold text-white bg-white/5 border border-white/5 px-2.5 py-1 rounded-sm">
                                    {customer.totalPartnershipRequests}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-right font-light text-white/70">
                                  {new Date(customer.lastActivity).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <button
                                    onClick={() => selectCustomerProfile(customer)}
                                    className="px-3.5 py-2 bg-[#0d3b0d] hover:bg-[#c09f53] text-[#c09f53] hover:text-[#0d3b0d] border border-[#c09f53]/30 rounded-sm font-mono text-[10px] tracking-widest uppercase transition-colors font-semibold cursor-pointer shadow-md"
                                  >
                                    View CRM Profile
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Footer */}
                      {customersTotalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 bg-[#0d3b0d]/20 border-t border-white/5 text-xs font-mono">
                          <span className="text-[#e5d7af]/50">
                            Showing page <strong>{customersPage}</strong> of <strong>{customersTotalPages}</strong> ({customers.length} total)
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setCustomersPage(p => Math.max(1, p - 1))}
                              disabled={customersPage === 1}
                              className="px-3 py-1.5 border border-white/10 hover:border-[#c09f53]/40 text-[#e5d7af] disabled:opacity-40 rounded-sm cursor-pointer transition-colors"
                            >
                              PREV
                            </button>
                            <button
                              onClick={() => setCustomersPage(p => Math.min(customersTotalPages, p + 1))}
                              disabled={customersPage === customersTotalPages}
                              className="px-3 py-1.5 border border-white/10 hover:border-[#c09f53]/40 text-[#e5d7af] disabled:opacity-40 rounded-sm cursor-pointer transition-colors"
                            >
                              NEXT
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

              </div>
            )}

            {/* -------------------------------------------------------------------
                VIEW D: EVENT BOOKINGS tab view
                ------------------------------------------------------------------- */}
            {activeTab === "bookings" && (
              <div className="space-y-6" id="bookings-tab-view">
                
                {/* Controllers Bar */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch bg-[#0d3b0d]/20 border border-white/5 p-4 rounded-sm">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#c09f53]/60 pointer-events-none">
                      <Search size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search bookings by event type, customer details, or venue..."
                      value={bookingsSearch}
                      onChange={(e) => {
                        setBookingsSearch(e.target.value);
                        setBookingsPage(1);
                      }}
                      className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white pl-10 pr-4 py-2.5 rounded-sm text-xs font-sans focus:outline-none focus:border-[#c09f53]"
                    />
                  </div>

                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex gap-2 items-center">
                      <span className="font-mono text-[9px] text-[#e5d7af]/55 uppercase tracking-widest shrink-0">STATUS:</span>
                      <select
                        value={bookingsStatusFilter}
                        onChange={(e) => {
                          setBookingsStatusFilter(e.target.value);
                          setBookingsPage(1);
                        }}
                        className="bg-[#0a2e0a] border border-[#c09f53]/25 text-[#f4edd9] py-2 px-3 text-xs rounded-sm focus:outline-none font-sans"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="flex gap-2 items-center">
                      <span className="font-mono text-[9px] text-[#e5d7af]/55 uppercase tracking-widest shrink-0">SORT BY:</span>
                      <select
                        value={bookingsSortBy}
                        onChange={(e) => {
                          setBookingsSortBy(e.target.value);
                          setBookingsPage(1);
                        }}
                        className="bg-[#0a2e0a] border border-[#c09f53]/25 text-[#f4edd9] py-2 px-3 text-xs rounded-sm focus:outline-none font-sans"
                      >
                        <option value="newest">Newest Submissions</option>
                        <option value="oldest">Oldest Submissions</option>
                        <option value="event_date">Event Date (Ascending)</option>
                        <option value="guests_high">Guest Count (High to Low)</option>
                        <option value="guests_low">Guest Count (Low to High)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-[#0d3b0d]/10 border border-white/5 rounded-sm overflow-hidden shadow-xl">
                  {filteredBookings.length === 0 ? (
                    <div className="text-center py-24 text-[#e5d7af]/40 font-mono text-xs uppercase">
                      No matching event bookings could be located.
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-sans">
                          <thead className="bg-[#0d3b0d]/50 font-mono text-[10px] text-[#c09f53] tracking-widest uppercase border-b border-white/5">
                            <tr>
                              <th className="py-4 px-6 font-semibold">CUSTOMER</th>
                              <th className="py-4 px-6 font-semibold">EVENT TYPE</th>
                              <th className="py-4 px-6 font-semibold text-center">GUESTS</th>
                              <th className="py-4 px-6 font-semibold">PREFERRED DATE</th>
                              <th className="py-4 px-6">VENUE</th>
                              <th className="py-4 px-6 text-center">STATUS</th>
                              <th className="py-4 px-6 text-right">ACTION</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-white/80 font-light">
                            {paginatedBookings.map((booking) => (
                              <tr key={booking.id} className="hover:bg-[#0d3b0d]/20 transition-colors">
                                <td className="py-4 px-6">
                                  <div className="font-serif text-sm text-white font-medium">{booking.customerName || "Unknown"}</div>
                                  <span className="text-[10px] font-mono text-[#e5d7af]/50 block">{booking.customerEmail}</span>
                                </td>
                                <td className="py-4 px-6 font-medium text-white">{booking.eventType}</td>
                                <td className="py-4 px-6 text-center font-mono font-medium">{booking.guestCount}</td>
                                <td className="py-4 px-6 font-mono text-[#c09f53] font-bold">{booking.eventDate}</td>
                                <td className="py-4 px-6">{booking.venue}</td>
                                <td className="py-4 px-6 text-center">
                                  <span className={`px-2 py-0.5 text-[9px] font-mono rounded-sm uppercase tracking-wider ${getStatusBadgeClass(booking.bookingStatus)}`}>
                                    {booking.bookingStatus}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => setEditingBooking(booking)}
                                      className="p-1.5 border border-white/10 hover:border-[#c09f53]/40 text-[#e5d7af] hover:text-[#c09f53] transition-colors rounded-sm cursor-pointer"
                                      title="Edit Status / Details"
                                    >
                                      <Edit3 size={13} />
                                    </button>
                                    <button
                                      onClick={() => setShowDeleteConfirm({ id: booking.id, type: "booking" })}
                                      className="p-1.5 border border-rose-950/40 hover:border-rose-500/30 text-rose-300 hover:bg-rose-950/20 transition-colors rounded-sm cursor-pointer"
                                      title="Delete record"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Footer */}
                      {bookingsTotalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 bg-[#0d3b0d]/20 border-t border-white/5 text-xs font-mono">
                          <span className="text-[#e5d7af]/50">
                            Showing page <strong>{bookingsPage}</strong> of <strong>{bookingsTotalPages}</strong> ({filteredBookings.length} total)
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setBookingsPage(p => Math.max(1, p - 1))}
                              disabled={bookingsPage === 1}
                              className="px-3 py-1.5 border border-white/10 hover:border-[#c09f53]/40 text-[#e5d7af] disabled:opacity-40 rounded-sm cursor-pointer transition-colors"
                            >
                              PREV
                            </button>
                            <button
                              onClick={() => setBookingsPage(p => Math.min(bookingsTotalPages, p + 1))}
                              disabled={bookingsPage === bookingsTotalPages}
                              className="px-3 py-1.5 border border-white/10 hover:border-[#c09f53]/40 text-[#e5d7af] disabled:opacity-40 rounded-sm cursor-pointer transition-colors"
                            >
                              NEXT
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

              </div>
            )}

            {/* -------------------------------------------------------------------
                VIEW E: PARTNERSHIP REQUESTS tab view
                ------------------------------------------------------------------- */}
            {activeTab === "partnerships" && (
              <div className="space-y-6" id="partnerships-tab-view">
                
                {/* Controllers Bar */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch bg-[#0d3b0d]/20 border border-white/5 p-4 rounded-sm">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#c09f53]/60 pointer-events-none">
                      <Search size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search partnerships by club name, contact, city, or message..."
                      value={partnershipsSearch}
                      onChange={(e) => {
                        setPartnershipsSearch(e.target.value);
                        setPartnershipsPage(1);
                      }}
                      className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white pl-10 pr-4 py-2.5 rounded-sm text-xs font-sans focus:outline-none focus:border-[#c09f53]"
                    />
                  </div>

                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex gap-2 items-center">
                      <span className="font-mono text-[9px] text-[#e5d7af]/55 uppercase tracking-widest shrink-0">MODEL:</span>
                      <select
                        value={partnershipsModelFilter}
                        onChange={(e) => {
                          setPartnershipsModelFilter(e.target.value);
                          setPartnershipsPage(1);
                        }}
                        className="bg-[#0a2e0a] border border-[#c09f53]/25 text-[#f4edd9] py-2 px-3 text-xs rounded-sm focus:outline-none font-sans"
                      >
                        <option value="All">All Models</option>
                        <option value="Profit-sharing Partnership">Profit Share</option>
                        <option value="Lease agreement">Lease Agreement</option>
                        <option value="Strategic Alliance Consultation">Strategic Alliance</option>
                      </select>
                    </div>

                    {uniqueCities.length > 0 && (
                      <div className="flex gap-2 items-center">
                        <span className="font-mono text-[9px] text-[#e5d7af]/55 uppercase tracking-widest shrink-0">CITY:</span>
                        <select
                          value={partnershipsCityFilter}
                          onChange={(e) => {
                            setPartnershipsCityFilter(e.target.value);
                            setPartnershipsPage(1);
                          }}
                          className="bg-[#0a2e0a] border border-[#c09f53]/25 text-[#f4edd9] py-2 px-3 text-xs rounded-sm focus:outline-none font-sans"
                        >
                          <option value="All">All Cities</option>
                          {uniqueCities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex gap-2 items-center">
                      <span className="font-mono text-[9px] text-[#e5d7af]/55 uppercase tracking-widest shrink-0">SORT:</span>
                      <select
                        value={partnershipsSortBy}
                        onChange={(e) => {
                          setPartnershipsSortBy(e.target.value);
                          setPartnershipsPage(1);
                        }}
                        className="bg-[#0a2e0a] border border-[#c09f53]/25 text-[#f4edd9] py-2 px-3 text-xs rounded-sm focus:outline-none font-sans"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="city_asc">City Name (A-Z)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Partnerships Table */}
                <div className="bg-[#0d3b0d]/10 border border-white/5 rounded-sm overflow-hidden shadow-xl">
                  {filteredPartnerships.length === 0 ? (
                    <div className="text-center py-24 text-[#e5d7af]/40 font-mono text-xs uppercase">
                      No matching partnership requests could be located.
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-sans">
                          <thead className="bg-[#0d3b0d]/50 font-mono text-[10px] text-[#c09f53] tracking-widest uppercase border-b border-white/5">
                            <tr>
                              <th className="py-4 px-6 font-semibold">CLUB / FACILITY</th>
                              <th className="py-4 px-6 font-semibold">CONTACT PERSON</th>
                              <th className="py-4 px-6 font-semibold">PARTNERSHIP MODEL</th>
                              <th className="py-4 px-6">TARGET CITY</th>
                              <th className="py-4 px-6 font-semibold">SUBMITTED DATE</th>
                              <th className="py-4 px-6 text-right">ACTION</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-white/80 font-light">
                            {paginatedPartnerships.map((p) => (
                              <tr key={p.id} className="hover:bg-[#0d3b0d]/20 transition-colors">
                                <td className="py-4 px-6">
                                  <div className="font-serif text-sm text-white font-medium">{p.clubName}</div>
                                  <span className="text-[10px] font-mono text-[#e5d7af]/50 block">ID: {p.id}</span>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="font-serif text-sm text-white font-medium">{p.fullName}</div>
                                  <a href={`https://wa.me/${p.whatsappNumber.replace(/[\s+]/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-mono text-[11px] hover:underline block mt-0.5">
                                    {p.whatsappNumber}
                                  </a>
                                </td>
                                <td className="py-4 px-6">
                                  <span className="font-mono text-[9px] bg-[#c09f53]/15 text-[#c09f53] border border-[#c09f53]/20 px-2.5 py-1 rounded-sm uppercase tracking-wider block w-max">
                                    {p.partnershipModel}
                                  </span>
                                </td>
                                <td className="py-4 px-6 font-semibold">{p.city}</td>
                                <td className="py-4 px-6 font-light">{new Date(p.createdAt).toLocaleDateString()}</td>
                                <td className="py-4 px-6 text-right">
                                  <button
                                    onClick={() => setShowDeleteConfirm({ id: p.id, type: "partnership" })}
                                    className="p-1.5 border border-rose-950/40 hover:border-rose-500/30 text-rose-300 hover:bg-rose-950/20 transition-colors rounded-sm cursor-pointer"
                                    title="Purge record"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Footer */}
                      {partnershipsTotalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 bg-[#0d3b0d]/20 border-t border-white/5 text-xs font-mono">
                          <span className="text-[#e5d7af]/50">
                            Showing page <strong>{partnershipsPage}</strong> of <strong>{partnershipsTotalPages}</strong> ({filteredPartnerships.length} total)
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setPartnershipsPage(p => Math.max(1, p - 1))}
                              disabled={partnershipsPage === 1}
                              className="px-3 py-1.5 border border-white/10 hover:border-[#c09f53]/40 text-[#e5d7af] disabled:opacity-40 rounded-sm cursor-pointer transition-colors"
                            >
                              PREV
                            </button>
                            <button
                              onClick={() => setPartnershipsPage(p => Math.min(partnershipsTotalPages, p + 1))}
                              disabled={partnershipsPage === partnershipsTotalPages}
                              className="px-3 py-1.5 border border-white/10 hover:border-[#c09f53]/40 text-[#e5d7af] disabled:opacity-40 rounded-sm cursor-pointer transition-colors"
                            >
                              NEXT
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

              </div>
            )}

            {/* -------------------------------------------------------------------
                VIEW F: USER MANAGEMENT (Super Admin only)
                ------------------------------------------------------------------- */}
            {activeTab === "users" && userRole === "super_admin" && (
              <div className="space-y-6" id="user-management-tab-view">
                
                <div className="flex justify-between items-center bg-[#0d3b0d]/20 border border-white/5 p-4 rounded-sm flex-wrap gap-4">
                  <div>
                    <h3 className="font-serif text-lg text-white font-medium">Administrator Accounts Roster</h3>
                    <p className="font-sans text-xs text-[#e5d7af]/60 font-light">Provision administrative credentials and govern secure access profiles</p>
                  </div>
                  <button
                    onClick={() => {
                      setAdminSetupError("");
                      setShowAddAdminModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#c09f53] hover:bg-[#aa863e] text-[#0d3b0d] hover:text-white text-xs font-mono font-bold tracking-wider uppercase transition-all rounded-sm cursor-pointer shadow-md"
                  >
                    <PlusCircle size={14} /> Provision Secondary Admin
                  </button>
                </div>

                <div className="bg-[#0d3b0d]/10 border border-white/5 rounded-sm overflow-hidden shadow-xl">
                  {allAdmins.length === 0 ? (
                    <div className="text-center py-24 text-[#e5d7af]/40 font-mono text-xs uppercase">
                      No administrators provisioned in database roster.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans">
                        <thead className="bg-[#0d3b0d]/50 font-mono text-[10px] text-[#c09f53] tracking-widest uppercase border-b border-white/5">
                          <tr>
                            <th className="py-4 px-6 font-semibold">NAME / SIGNATURE</th>
                            <th className="py-4 px-6 font-semibold">EMAIL USERNAME</th>
                            <th className="py-4 px-6 font-semibold">SYSTEM LEVEL / ROLE</th>
                            <th className="py-4 px-6 font-semibold">PROVISIONED DATE</th>
                            <th className="py-4 px-6 text-right">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-white/80 font-light">
                          {allAdmins.map((admin) => {
                            const isSelf = admin.username === adminEmail;
                            const isSuper = admin.role === "super_admin";
                            return (
                              <tr key={admin.id} className="hover:bg-[#0d3b0d]/20 transition-colors">
                                <td className="py-4 px-6">
                                  <div className="font-serif text-sm text-white font-medium flex items-center gap-2">
                                    {admin.fullName}
                                    {isSelf && (
                                      <span className="text-[8px] font-mono bg-[#c09f53]/20 text-[#c09f53] border border-[#c09f53]/30 px-1.5 py-0.2 rounded-sm uppercase tracking-wider">
                                        YOU
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-4 px-6 font-mono font-medium text-white/90">{admin.username}</td>
                                <td className="py-4 px-6">
                                  <span className={`px-2.5 py-0.5 rounded-sm text-[9px] font-mono uppercase tracking-widest ${
                                    isSuper
                                      ? "bg-[#c09f53]/15 text-[#c09f53] border border-[#c09f53]/30"
                                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  }`}>
                                    {isSuper ? "Super Administrator" : "Secondary Admin"}
                                  </span>
                                </td>
                                <td className="py-4 px-6 font-light">{new Date(admin.createdAt).toLocaleDateString()}</td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => {
                                        setEditingAdmin(admin);
                                        setEditAdminFullName(admin.fullName);
                                        setEditAdminPassword("");
                                      }}
                                      className="px-2.5 py-1.5 border border-white/10 hover:border-[#c09f53]/40 text-[#e5d7af] hover:text-[#c09f53] transition-colors rounded-sm text-[10px] font-mono uppercase tracking-wider cursor-pointer"
                                    >
                                      Edit Settings
                                    </button>
                                    {!isSuper && (
                                      <button
                                        onClick={() => handleDeleteAdmin(admin.id, admin.fullName)}
                                        className="p-1.5 border border-rose-950/40 hover:border-rose-500/30 text-rose-300 hover:bg-rose-950/20 transition-colors rounded-sm cursor-pointer"
                                        title="Purge access credentials"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* -------------------------------------------------------------------
                VIEW G: SYSTEM SETTINGS (Super Admin only - Locked / Unlocked States)
                ------------------------------------------------------------------- */}
            {activeTab === "settings" && userRole === "super_admin" && (
              <div className="space-y-6" id="settings-tab-view">
                {!isSettingsVerified ? (
                  /* Locked state screen */
                  <div className="max-w-md mx-auto my-12 bg-[#0d3b0d]/40 border border-red-500/20 p-8 rounded-sm text-center space-y-6">
                    <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full flex items-center justify-center mx-auto">
                      <Lock size={32} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-serif text-xl text-white font-medium">Settings Locked</h3>
                      <p className="font-sans text-xs text-[#e5d7af]/70 font-light leading-relaxed">
                        Enter your current password to unlock Settings and manage administrator options.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSettingsUnlockPassword("");
                        setSettingsUnlockError("");
                        setShowSettingsUnlockModal(true);
                      }}
                      className="w-full py-3 bg-[#c09f53] hover:bg-[#aa863e] text-[#0d3b0d] font-mono text-xs tracking-widest uppercase font-bold rounded-sm shadow-md transition-colors cursor-pointer"
                    >
                      Verify Password to Unlock
                    </button>
                  </div>
                ) : (
                  /* Unlocked settings panel */
                  <div className="space-y-6">
                    {/* Settings Header */}
                    <div className="bg-[#0d3b0d]/20 border border-white/5 p-6 rounded-sm flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <h3 className="font-serif text-2xl text-white font-medium">
                          Secure Settings
                        </h3>
                        <p className="font-sans text-xs text-[#e5d7af]/60 font-light mt-1 max-w-2xl">
                          Lock this section to prevent unauthorized access. This section contains account-related options such as email management, password updates, and administrator settings.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsSettingsVerified(false);
                          setActiveTab("dashboard");
                          showToast("Settings area locked successfully.");
                        }}
                        className="px-3 py-1.5 border border-red-500/30 hover:border-red-500/60 bg-red-950/20 text-red-300 font-mono text-[10px] tracking-wider uppercase rounded-sm cursor-pointer transition-colors"
                      >
                        Lock Settings
                      </button>
                    </div>

                    {/* Sub-tab Navigation */}
                    <div className="flex border-b border-white/5 gap-2 pb-px overflow-x-auto">
                      <button
                        onClick={() => setSettingsSubTab("account")}
                        className={`px-4 py-2.5 text-xs font-mono tracking-widest uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                          settingsSubTab === "account"
                            ? "border-[#c09f53] text-[#c09f53] font-semibold bg-[#c09f53]/5"
                            : "border-transparent text-[#e5d7af]/55 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        Primary Email
                      </button>
                      <button
                        onClick={() => setSettingsSubTab("password")}
                        className={`px-4 py-2.5 text-xs font-mono tracking-widest uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                          settingsSubTab === "password"
                            ? "border-[#c09f53] text-[#c09f53] font-semibold bg-[#c09f53]/5"
                            : "border-transparent text-[#e5d7af]/55 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        Change Password
                      </button>
                      <button
                        onClick={() => setSettingsSubTab("roster")}
                        className={`px-4 py-2.5 text-xs font-mono tracking-widest uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                          settingsSubTab === "roster"
                            ? "border-[#c09f53] text-[#c09f53] font-semibold bg-[#c09f53]/5"
                            : "border-transparent text-[#e5d7af]/55 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        Administrative Roster
                      </button>
                    </div>

                    {/* Sub-tab content: Account settings / Primary Email */}
                    {settingsSubTab === "account" && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7 space-y-6">
                          {/* Card 1: Secure Email Change */}
                          <div className="bg-[#0d3b0d]/30 border border-[#c09f53]/20 p-6 rounded-sm space-y-4">
                            <h4 className="font-serif text-lg text-white font-medium flex items-center gap-2">
                              <Shield size={18} className="text-[#c09f53]" /> Primary Admin Email
                            </h4>
                            
                            <p className="font-sans text-xs text-[#e5d7af]/80 font-light leading-relaxed">
                              Update your primary administrator email securely. Your current password is required before any changes can be made.
                            </p>

                            <div className="bg-[#0a2e0a]/40 p-4 rounded-sm border border-white/5 space-y-2">
                              <span className="text-[#c09f53] font-mono text-[9px] tracking-wider block uppercase">Current Email</span>
                              <strong className="text-white font-mono text-sm break-all">{adminEmail}</strong>
                              <span className="text-emerald-400 font-mono text-[9px] flex items-center gap-1 mt-1">
                                <CheckCircle2 size={11} /> Verified
                              </span>
                            </div>

                            <form onSubmit={handleRequestEmailChange} className="space-y-4 font-sans text-xs pt-2">
                              <div>
                                <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                                  Current Password
                                </label>
                                <input
                                  type="password"
                                  value={changeEmailPassword}
                                  onChange={(e) => setChangeEmailPassword(e.target.value)}
                                  placeholder="••••••••"
                                  required
                                  className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#c09f53]"
                                />
                              </div>

                              <div>
                                <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                                  New Email
                                </label>
                                <input
                                  type="email"
                                  value={changeEmailNewEmail}
                                  onChange={(e) => setChangeEmailNewEmail(e.target.value)}
                                  placeholder="new-admin@horizon.com"
                                  required
                                  className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#c09f53]"
                                />
                              </div>

                              {emailChangeStatus && (
                                <div className={`p-3 rounded-sm text-xs font-sans border ${
                                  emailChangeStatus.type === "success" 
                                    ? "bg-emerald-950/40 border-emerald-800 text-emerald-200" 
                                    : "bg-rose-950/40 border-rose-800 text-rose-200"
                                }`}>
                                  {emailChangeStatus.text}
                                </div>
                              )}

                              <button
                                type="submit"
                                disabled={isChangingEmail}
                                className="w-full sm:w-auto px-6 py-3 bg-[#c09f53] hover:bg-[#aa863e] text-[#0d3b0d] font-mono text-xs tracking-widest uppercase font-bold rounded-sm shadow-md transition-colors cursor-pointer disabled:opacity-50"
                              >
                                {isChangingEmail ? "Sending..." : "Send Verification"}
                              </button>
                            </form>
                          </div>
                        </div>

                    
                                {/* Right side manual verification */}
                        <div className="lg:col-span-5 bg-[#0d3b0d]/45 border border-[#c09f53]/25 p-6 rounded-sm space-y-4">
                          <div>
                            <h4 className="font-serif text-lg text-white font-medium flex items-center gap-1.5">
                              <CheckCircle2 size={16} className="text-[#c09f53]" /> Email Verification
                            </h4>
                            <p className="font-sans text-xs text-[#e5d7af]/50 mt-1 font-light">
                              Enter the verification code sent to your email to confirm your email change request.
                            </p>
                          </div>

                          <div className="space-y-4 text-xs font-sans">
                            <div className="space-y-3 pt-2">
                              <div>
                                <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                                  Verification Code
                                </label>
                                <input
                                  type="text"
                                  id="manual_verification_token"
                                  placeholder="Verification code"
                                  className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-3 py-2.5 rounded-sm font-mono text-xs focus:outline-none focus:border-[#c09f53]"
                                />
                              </div>

                              <button
                                onClick={() => {
                                  const tokenInput = document.getElementById("manual_verification_token") as HTMLInputElement;
                                  if (!tokenInput || !tokenInput.value.trim()) {
                                    showToast("Please enter a valid verification code.", "error");
                                    return;
                                  }
                                  handleConfirmEmailChange(tokenInput.value.trim());
                                }}
                                disabled={isVerifyingEmailChange}
                                className="w-full py-3 bg-[#c09f53] hover:bg-[#aa863e] text-[#0d3b0d] font-mono text-xs tracking-widest uppercase font-bold rounded-sm shadow-md transition-colors cursor-pointer disabled:opacity-50"
                              >
                                {isVerifyingEmailChange ? "Verifying..." : "Verify & Update Email"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sub-tab content: Password change */}
                    {settingsSubTab === "password" && (
                      <div className="max-w-2xl bg-[#0d3b0d]/45 border border-[#c09f53]/25 p-6 rounded-sm space-y-4">
                        <div>
                          <h4 className="font-serif text-lg text-white font-medium flex items-center gap-1.5">
                            <Lock size={16} className="text-[#c09f53]" /> Change Administrator Password
                          </h4>
                          <p className="font-sans text-xs text-[#e5d7af]/50 mt-1 font-light">
                            Configure a new secure password. Changes require strong security structures and will invalidate all active sessions.
                          </p>
                        </div>

                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            if (!changePasswordCurrent || !changePasswordNew || !changePasswordConfirm) {
                              showToast("All password fields are required.", "error");
                              return;
                            }
                            if (changePasswordNew !== changePasswordConfirm) {
                              showToast("Passwords do not match.", "error");
                              return;
                            }
                            setIsChangingPassword(true);
                            try {
                              const res = await fetch("/api/hlg-portal/admin/change-password", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                  currentPassword: changePasswordCurrent,
                                  newPassword: changePasswordNew,
                                  confirmPassword: changePasswordConfirm,
                                }),
                              });
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.error || "Failed to update password.");
                              
                              showToast("Password updated successfully. Session invalidated.", "success");
                              setChangePasswordCurrent("");
                              setChangePasswordNew("");
                              setChangePasswordConfirm("");
                              
                              alert("Your password has been successfully updated. All active sessions have been invalidated. Please log in again.");
                              handleLogout();
                            } catch (err) {
                              showToast((err as Error).message, "error");
                            } finally {
                              setIsChangingPassword(false);
                            }
                          }}
                          className="space-y-4 font-sans text-xs"
                        >
                          <div>
                            <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                              CURRENT PASSWORD
                            </label>
                            <input
                              type="password"
                              value={changePasswordCurrent}
                              onChange={(e) => setChangePasswordCurrent(e.target.value)}
                              placeholder="••••••••"
                              required
                              className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#c09f53]"
                            />
                          </div>

                          <div>
                            <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                              NEW ACCESS PASSWORD
                            </label>
                            <input
                              type="password"
                              value={changePasswordNew}
                              onChange={(e) => setChangePasswordNew(e.target.value)}
                              placeholder="••••••••"
                              required
                              className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#c09f53]"
                            />
                            <p className="text-[10px] text-[#e5d7af]/40 mt-1">
                              Must contain at least 8 characters, an uppercase and lowercase letter, a number, and a special character.
                            </p>
                          </div>

                          <div>
                            <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                              CONFIRM NEW PASSWORD
                            </label>
                            <input
                              type="password"
                              value={changePasswordConfirm}
                              onChange={(e) => setChangePasswordConfirm(e.target.value)}
                              placeholder="••••••••"
                              required
                              className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#c09f53]"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isChangingPassword}
                            className="w-full py-3 bg-[#c09f53] hover:bg-[#aa863e] text-[#0d3b0d] font-mono text-xs tracking-widest uppercase font-bold rounded-sm shadow-md transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {isChangingPassword ? "Updating Password..." : "Save Password"}
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Sub-tab content: Roster management */}
                    {settingsSubTab === "roster" && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center bg-[#0d3b0d]/20 border border-white/5 p-4 rounded-sm flex-wrap gap-4">
                          <div>
                            <h3 className="font-serif text-lg text-white font-medium">Administrator Accounts Roster</h3>
                            <p className="font-sans text-xs text-[#e5d7af]/60 font-light">Provision administrative credentials and govern secure access profiles</p>
                          </div>
                          <button
                            onClick={() => {
                              setAdminSetupError("");
                              setShowAddAdminModal(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-[#c09f53] hover:bg-[#aa863e] text-[#0d3b0d] hover:text-white text-xs font-mono font-bold tracking-wider uppercase transition-all rounded-sm cursor-pointer shadow-md"
                          >
                            <PlusCircle size={14} /> Provision Secondary Admin
                          </button>
                        </div>

                        <div className="bg-[#0d3b0d]/10 border border-white/5 rounded-sm overflow-hidden shadow-xl">
                          {allAdmins.length === 0 ? (
                            <div className="text-center py-24 text-[#e5d7af]/40 font-mono text-xs uppercase">
                              No administrators provisioned in database roster.
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs font-sans">
                                <thead className="bg-[#0d3b0d]/50 font-mono text-[10px] text-[#c09f53] tracking-widest uppercase border-b border-white/5">
                                  <tr>
                                    <th className="py-4 px-6 font-semibold">NAME / SIGNATURE</th>
                                    <th className="py-4 px-6 font-semibold">EMAIL USERNAME</th>
                                    <th className="py-4 px-6 font-semibold">SYSTEM LEVEL / ROLE</th>
                                    <th className="py-4 px-6 font-semibold">PROVISIONED DATE</th>
                                    <th className="py-4 px-6 text-right">ACTIONS</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-white/80 font-light">
                                  {allAdmins.map((admin) => {
                                    const isSelf = admin.username === adminEmail;
                                    const isSuper = admin.role === "super_admin";
                                    return (
                                      <tr key={admin.id} className="hover:bg-[#0d3b0d]/20 transition-colors">
                                        <td className="py-4 px-6">
                                          <div className="font-serif text-sm text-white font-medium flex items-center gap-2">
                                            {admin.fullName}
                                            {isSelf && (
                                              <span className="text-[8px] font-mono bg-[#c09f53]/20 text-[#c09f53] border border-[#c09f53]/30 px-1.5 py-0.2 rounded-sm uppercase tracking-wider">
                                                YOU
                                              </span>
                                            )}
                                          </div>
                                        </td>
                                        <td className="py-4 px-6 font-mono font-medium text-white/90">{admin.username}</td>
                                        <td className="py-4 px-6">
                                          <span className={`px-2.5 py-0.5 rounded-sm text-[9px] font-mono uppercase tracking-widest ${
                                            isSuper
                                              ? "bg-[#c09f53]/15 text-[#c09f53] border border-[#c09f53]/30"
                                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                          }`}>
                                            {isSuper ? "Super Administrator" : "Secondary Admin"}
                                          </span>
                                        </td>
                                        <td className="py-4 px-6 font-light">{new Date(admin.createdAt).toLocaleDateString()}</td>
                                        <td className="py-4 px-6 text-right">
                                          <div className="flex gap-2 justify-end">
                                            <button
                                              onClick={() => {
                                                setEditingAdmin(admin);
                                                setEditAdminFullName(admin.fullName);
                                                setEditAdminPassword("");
                                              }}
                                              className="px-2.5 py-1.5 border border-white/10 hover:border-[#c09f53]/40 text-[#e5d7af] hover:text-[#c09f53] transition-colors rounded-sm text-[10px] font-mono uppercase tracking-wider cursor-pointer"
                                            >
                                              Edit Settings
                                            </button>
                                            {!isSuper && (
                                              <button
                                                onClick={() => handleDeleteAdmin(admin.id, admin.fullName)}
                                                className="p-1.5 border border-rose-950/40 hover:border-rose-500/30 text-rose-300 hover:bg-rose-950/20 transition-colors rounded-sm cursor-pointer"
                                                title="Purge access credentials"
                                              >
                                                <Trash2 size={13} />
                                              </button>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Access Denied screen for Secondary Admins if they somehow try to view settings */}
            {activeTab === "settings" && userRole !== "super_admin" && (
              <div className="max-w-md mx-auto my-24 bg-[#0d3b0d]/40 border border-red-500/20 p-8 rounded-sm text-center space-y-4">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full flex items-center justify-center mx-auto">
                  <ShieldAlert size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-lg text-white font-medium">Access Forbidden</h3>
                  <p className="font-sans text-xs text-[#e5d7af]/70 font-light leading-relaxed">
                    You do not have permission to view the settings dashboard. This configuration area is restricted to the Super Administrator.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="px-4 py-2 bg-[#c09f53] hover:bg-[#aa863e] text-[#0d3b0d] font-mono text-xs uppercase font-bold rounded-sm cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

          </>
        )}

      </main>

      {/* -------------------------------------------------------------------
          MODAL 1: EDIT EVENT BOOKING DETAILS
          ------------------------------------------------------------------- */}
      <AnimatePresence>
        {editingBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#041910]/80 backdrop-blur-sm" id="edit-booking-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0d3b0d] border border-[#c09f53]/25 p-8 rounded-sm w-full max-w-lg shadow-2xl relative"
            >
              <button
                onClick={() => setEditingBooking(null)}
                className="absolute top-4 right-4 text-[#e5d7af]/50 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="font-serif text-2xl text-[#f4edd9] mb-1">Edit Event Booking</h3>
              <p className="font-sans text-xs text-[#e5d7af]/50 border-b border-white/5 pb-4 mb-6">
                Modify event configurations or administrative status codes
              </p>

              <form onSubmit={handleUpdateBooking} className="space-y-4" id="edit-booking-form">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                      EVENT CATEGORY
                    </label>
                    <select
                      value={editingBooking.eventType}
                      onChange={(e) => setEditingBooking({ ...editingBooking, eventType: e.target.value })}
                      className="w-full bg-[#0a2e0a] border border-white/10 text-white py-2.5 px-3 rounded-sm font-sans text-xs focus:outline-none"
                    >
                      <option value="Corporate">Corporate</option>
                      <option value="Matrimonial">Matrimonial</option>
                      <option value="Birthday">Birthday</option>
                      <option value="School & Academic">School & Academic</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                      GUEST REGISTRATION
                    </label>
                    <input
                      type="text"
                      value={editingBooking.guestCount}
                      onChange={(e) => setEditingBooking({ ...editingBooking, guestCount: e.target.value })}
                      className="w-full bg-[#0a2e0a] border border-white/10 text-white py-2.5 px-3 rounded-sm font-sans text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                      EVENT DATE
                    </label>
                    <input
                      type="date"
                      value={editingBooking.eventDate}
                      onChange={(e) => setEditingBooking({ ...editingBooking, eventDate: e.target.value })}
                      className="w-full bg-[#0a2e0a] border border-white/10 text-white py-2.5 px-3 rounded-sm font-sans text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                      BOOKING STATUS
                    </label>
                    <select
                      value={editingBooking.bookingStatus}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          bookingStatus: e.target.value as any,
                        })
                      }
                      className="w-full bg-[#0a2e0a] border border-white/10 text-white py-2.5 px-3 rounded-sm font-sans text-xs focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                    PREFERRED LEISURE VENUE
                  </label>
                  <input
                    type="text"
                    value={editingBooking.venue}
                    onChange={(e) => setEditingBooking({ ...editingBooking, venue: e.target.value })}
                    className="w-full bg-[#0a2e0a] border border-white/10 text-white py-2.5 px-3 rounded-sm font-sans text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                    ADMINISTRATIVE NOTES / DETAILS
                  </label>
                  <textarea
                    rows={3}
                    value={editingBooking.notes || ""}
                    onChange={(e) => setEditingBooking({ ...editingBooking, notes: e.target.value })}
                    className="w-full bg-[#0a2e0a] border border-white/10 text-white py-2 px-3 rounded-sm font-sans text-xs focus:outline-none resize-none"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setEditingBooking(null)}
                    className="px-4 py-2 border border-white/10 hover:border-white/20 text-[#e5d7af] text-xs font-mono tracking-wider uppercase rounded-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#c09f53] text-[#0d3b0d] text-xs font-mono font-bold tracking-wider uppercase rounded-sm cursor-pointer hover:bg-[#aa863e] transition-colors shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------------
          MODAL 2: CONFIRM DELETE DATA RECORD
          ------------------------------------------------------------------- */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#041910]/80 backdrop-blur-sm" id="delete-confirmation-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0d3b0d] border border-rose-500/20 p-6 rounded-sm w-full max-w-sm shadow-2xl text-center space-y-4"
            >
              <div className="w-12 h-12 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto">
                <ShieldAlert size={24} />
              </div>

              <div>
                <h4 className="font-serif text-lg text-white font-medium">
                  {showDeleteConfirm.type === "admin" ? "Delete Administrator" : "Confirm Record Deletion"}
                </h4>
                <p className="font-sans text-xs text-[#e5d7af]/60 mt-1 font-light leading-relaxed">
                  {showDeleteConfirm.type === "admin" ? (
                    `Are you absolutely certain you want to permanently delete the administrator "${showDeleteConfirm.adminName || ""}"? They will lose access immediately.`
                  ) : (
                    `Are you absolutely certain you wish to purge this ${showDeleteConfirm.type === "booking" ? "event booking" : "partnership proposal"} record? This structural database action is completely irreversible.`
                  )}
                </p>
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-white/10 hover:border-white/20 text-xs font-mono tracking-wider uppercase rounded-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteItem}
                  className="px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 text-xs font-mono tracking-wider uppercase rounded-sm cursor-pointer shadow-md"
                >
                  Confirm Purge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------------
          MODAL 3: SECURE SETTINGS PASSWORD UNLOCK
          ------------------------------------------------------------------- */}
      <AnimatePresence>
        {showSettingsUnlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#041910]/80 backdrop-blur-sm" id="settings-unlock-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0d3b0d] border border-[#c09f53]/25 p-8 rounded-sm w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => setShowSettingsUnlockModal(false)}
                className="absolute top-4 right-4 text-[#e5d7af]/50 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#c09f53]/10 border border-[#c09f53]/30 text-[#c09f53] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield size={22} />
                </div>
                <h3 className="font-serif text-xl text-[#f4edd9]">Password Verification</h3>
                <p className="font-sans text-xs text-[#e5d7af]/50 mt-1 font-light">
                  Please enter your password to authorize secure access to settings.
                </p>
              </div>

              <form onSubmit={handleVerifySettingsPassword} className="space-y-4" id="settings-unlock-form">
                <div>
                  <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    value={settingsUnlockPassword}
                    onChange={(e) => setSettingsUnlockPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isVerifyingSettingsPassword}
                    className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#c09f53] disabled:opacity-55"
                  />
                </div>

                {settingsUnlockError && (
                  <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-200 text-xs font-sans rounded-sm text-center">
                    {settingsUnlockError}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSettingsUnlockModal(false)}
                    disabled={isVerifyingSettingsPassword}
                    className="w-1/2 py-3 border border-white/10 hover:border-white/20 text-[#e5d7af] font-mono text-xs tracking-wider uppercase rounded-sm cursor-pointer disabled:opacity-55"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifyingSettingsPassword}
                    className="w-1/2 py-3 bg-[#c09f53] hover:bg-[#aa863e] text-[#0d3b0d] font-mono text-xs tracking-widest uppercase font-bold rounded-sm shadow-md transition-colors cursor-pointer disabled:opacity-55"
                  >
                    {isVerifyingSettingsPassword ? "Verifying..." : "Verify"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------------
          MODAL 4: PROVISION SECONDARY ADMINISTRATOR
          ------------------------------------------------------------------- */}
      <AnimatePresence>
        {showAddAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#041910]/80 backdrop-blur-sm" id="add-admin-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0d3b0d] border border-[#c09f53]/25 p-8 rounded-sm w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => setShowAddAdminModal(false)}
                className="absolute top-4 right-4 text-[#e5d7af]/50 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="font-serif text-2xl text-[#f4edd9] mb-1">Provision Administrator</h3>
              <p className="font-sans text-xs text-[#e5d7af]/50 border-b border-white/5 pb-4 mb-6">
                Create new administrative credentials and security configurations.
              </p>

              <form onSubmit={handleCreateAdmin} className="space-y-4" id="add-admin-form">
                <div>
                  <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                    NAME / SIGNATURE
                  </label>
                  <input
                    type="text"
                    value={newAdminFullName}
                    onChange={(e) => setNewAdminFullName(e.target.value)}
                    placeholder="e.g. Faisal Khan"
                    required
                    disabled={isCreatingAdmin}
                    className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#c09f53] disabled:opacity-55"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                    EMAIL USERNAME
                  </label>
                  <input
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="e.g. secondary-admin@horizon.com"
                    required
                    disabled={isCreatingAdmin}
                    className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#c09f53] disabled:opacity-55"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                    ACCESS PASSWORD
                  </label>
                  <input
                    type="password"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isCreatingAdmin}
                    className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#c09f53] disabled:opacity-55"
                  />
                </div>

                {adminSetupError && (
                  <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-200 text-xs font-sans rounded-sm text-center">
                    {adminSetupError}
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowAddAdminModal(false)}
                    disabled={isCreatingAdmin}
                    className="w-1/2 py-3 border border-white/10 hover:border-white/20 text-[#e5d7af] font-mono text-xs tracking-wider uppercase rounded-sm cursor-pointer disabled:opacity-55"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingAdmin}
                    className="w-1/2 py-3 bg-[#c09f53] hover:bg-[#aa863e] text-[#0d3b0d] font-mono text-xs tracking-widest uppercase font-bold rounded-sm shadow-md transition-colors cursor-pointer disabled:opacity-55"
                  >
                    {isCreatingAdmin ? "Provisioning..." : "Provision Admin"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------------
          MODAL 5: EDIT ADMINISTRATOR PROFILE
          ------------------------------------------------------------------- */}
      <AnimatePresence>
        {editingAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#041910]/80 backdrop-blur-sm" id="edit-admin-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0d3b0d] border border-[#c09f53]/25 p-8 rounded-sm w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => setEditingAdmin(null)}
                className="absolute top-4 right-4 text-[#e5d7af]/50 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="font-serif text-xl text-[#f4edd9] mb-1">Edit Administrator Settings</h3>
              <p className="font-sans text-xs text-[#e5d7af]/50 border-b border-white/5 pb-4 mb-6">
                Update name/signature or assign a critical access override password for <span className="font-mono font-medium text-white">{editingAdmin.username}</span>.
              </p>

              <form onSubmit={handleUpdateAdmin} className="space-y-4" id="edit-admin-form">
                <div>
                  <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                    NAME / SIGNATURE
                  </label>
                  <input
                    type="text"
                    value={editAdminFullName}
                    onChange={(e) => setEditAdminFullName(e.target.value)}
                    placeholder="Name"
                    required
                    disabled={isUpdatingAdmin}
                    className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#c09f53] disabled:opacity-55"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] text-[#c09f53] tracking-widest uppercase font-bold block mb-1.5">
                    NEW OVERRIDE PASSWORD (OPTIONAL)
                  </label>
                  <input
                    type="password"
                    value={editAdminPassword}
                    onChange={(e) => setEditAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isUpdatingAdmin}
                    className="w-full bg-[#0a2e0a] border border-[#c09f53]/20 text-white px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#c09f53] disabled:opacity-55"
                  />
                  <p className="text-[9px] text-[#e5d7af]/45 mt-1 leading-normal">
                    Leave blank to preserve their existing active password configuration.
                  </p>
                </div>

                <div className="flex gap-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setEditingAdmin(null)}
                    disabled={isUpdatingAdmin}
                    className="w-1/2 py-3 border border-white/10 hover:border-white/20 text-[#e5d7af] font-mono text-xs tracking-wider uppercase rounded-sm cursor-pointer disabled:opacity-55"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingAdmin}
                    className="w-1/2 py-3 bg-[#c09f53] hover:bg-[#aa863e] text-[#0d3b0d] font-mono text-xs tracking-widest uppercase font-bold rounded-sm shadow-md transition-colors cursor-pointer disabled:opacity-55"
                  >
                    {isUpdatingAdmin ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------------
          CRM TOAST NOTIFICATION FLOATER
          ------------------------------------------------------------------- */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            id="crm-toast-container"
            className={`fixed bottom-6 right-6 z-50 border px-4 py-3 rounded-sm shadow-2xl flex items-center gap-2 text-xs font-mono tracking-wider uppercase max-w-md ${
              message.type === "success"
                ? "bg-[#0d3b0d] border-[#c09f53]/55 text-white"
                : "bg-rose-950/90 border-rose-500 text-rose-200"
            }`}
          >
            <span className={message.type === "success" ? "text-[#c09f53]" : "text-rose-400"}>◆</span>
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
