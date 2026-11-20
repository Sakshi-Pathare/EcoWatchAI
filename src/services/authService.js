/**
 * Vasundhara AI - Authentication & Steward Identity Service
 * Provides robust session management, local storage fallback with simulated latency,
 * default multi-role demo profiles, and optional proxying to FastAPI backend.
 */

const STORAGE_KEY_USER = 'vasundhara_current_user_v2';
const STORAGE_KEY_TOKEN = 'vasundhara_auth_token_v2';
const STORAGE_KEY_REGISTRY = 'vasundhara_registered_users_v2';

// Pre-seeded demo credentials for instant testing & evaluation
export const DEMO_PROFILES = {
  citizen: {
    id: 'USR-CITIZEN-01',
    name: 'Alex Morgan',
    email: 'alex.steward@vasundhara.eco',
    password: 'Password123!',
    phone: '+91 98230 45678',
    role: 'citizen',
    roleLabel: 'Citizen Steward',
    karmaScore: 420,
    reportsCount: 14,
    cleanupsCount: 6,
    badge: 'Level 2 Eco Steward',
    municipalityName: 'Pune Municipal Corporation',
  },
  municipal_admin: {
    id: 'USR-OFFICER-02',
    name: 'Officer Rajesh Sharma',
    email: 'r.sharma@pune.gov.in',
    password: 'Password123!',
    phone: '+91 94220 12345',
    role: 'municipal_admin',
    roleLabel: 'Municipal Sanitation Officer',
    municipalityId: 'PMC-PUNE',
    municipalityName: 'Pune Municipal Corporation (PMC)',
    wardId: 'Ward 12 - Shivajinagar / Deccan',
    zoneId: 'Central Zone A',
    badge: 'Municipal Command Lead',
  },
  super_admin: {
    id: 'USR-SUPERADMIN-03',
    name: 'Dr. Ananya Roy',
    email: 'admin@vasundhara.eco',
    password: 'Password123!',
    phone: '+91 99880 99880',
    role: 'super_admin',
    roleLabel: 'System Super Administrator',
    badge: 'Platform Governor',
    permissions: ['*'],
  },
};

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REGISTRY);
    if (!raw) {
      // Seed initial registry with demo profiles
      const initial = Object.values(DEMO_PROFILES);
      localStorage.setItem(STORAGE_KEY_REGISTRY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return Object.values(DEMO_PROFILES);
  }
}

function saveStoredUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEY_REGISTRY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save user registry', e);
  }
}

export const authService = {
  /**
   * Retrieves the current logged in user from local storage or session
   */
  async getCurrentUser() {
    await new Promise((r) => setTimeout(r, 60));
    try {
      const rawUser = localStorage.getItem(STORAGE_KEY_USER) || sessionStorage.getItem(STORAGE_KEY_USER);
      if (!rawUser) return null;
      return JSON.parse(rawUser);
    } catch {
      return null;
    }
  },

  /**
   * Sign In with Email & Password
   */
  async login(email, password, remember = true) {
    await new Promise((r) => setTimeout(r, 350)); // natural responsiveness simulation

    const normalizedEmail = (email || '').trim().toLowerCase();
    const users = getStoredUsers();
    const matched = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!matched) {
      throw new Error('No registered account found with this email address.');
    }

    if (matched.password && matched.password !== password) {
      throw new Error('Invalid password. Please double check your credentials.');
    }

    const token = `vasundhara_jwt_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const storage = remember ? localStorage : sessionStorage;

    storage.setItem(STORAGE_KEY_USER, JSON.stringify(matched));
    storage.setItem(STORAGE_KEY_TOKEN, token);

    return matched;
  },

  /**
   * Register a new user account
   */
  async register(data, remember = true) {
    await new Promise((r) => setTimeout(r, 400));

    const normalizedEmail = (data.email || '').trim().toLowerCase();
    const users = getStoredUsers();

    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const role = data.role || 'citizen';
    let roleLabel = 'Citizen Steward';
    if (role === 'municipal_admin') roleLabel = 'Municipal Sanitation Official';
    if (role === 'super_admin') roleLabel = 'System Super Administrator';

    const newUser = {
      id: `USR-${Date.now().toString(36).toUpperCase()}`,
      name: data.name.trim(),
      email: normalizedEmail,
      phone: (data.phone || '').trim(),
      password: data.password,
      role: role,
      roleLabel: roleLabel,
      karmaScore: 50, // Welcome signup bonus
      reportsCount: 0,
      cleanupsCount: 0,
      badge: 'Novice Steward',
      municipalityName: data.municipalityName || 'Pune Municipal Corporation',
      registeredAt: new Date().toISOString(),
    };

    const updated = [newUser, ...users];
    saveStoredUsers(updated);

    const token = `vasundhara_jwt_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    storage.setItem(STORAGE_KEY_TOKEN, token);

    return newUser;
  },

  /**
   * 1-Click Quick Demo Sign In
   */
  async loginDemo(roleKey = 'citizen') {
    const profile = DEMO_PROFILES[roleKey] || DEMO_PROFILES.citizen;
    return this.login(profile.email, profile.password, true);
  },

  /**
   * Simulated Password Reset Request
   */
  async requestPasswordReset(email) {
    await new Promise((r) => setTimeout(r, 300));
    const normalizedEmail = (email || '').trim().toLowerCase();
    const users = getStoredUsers();
    const exists = users.some((u) => u.email.toLowerCase() === normalizedEmail);
    if (!exists) {
      throw new Error('No registered account associated with this email.');
    }
    return {
      success: true,
      message: `Password reset link dispatched to ${normalizedEmail}. Check your inbox.`,
    };
  },

  /**
   * Logout and clear tokens
   */
  async logout() {
    await new Promise((r) => setTimeout(r, 80));
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      sessionStorage.removeItem(STORAGE_KEY_USER);
      sessionStorage.removeItem(STORAGE_KEY_TOKEN);
    } catch (e) {
      console.error(e);
    }
    return true;
  },
};
