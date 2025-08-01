const API = 'http://127.0.0.1:5000';

export const tracker = {
  status: () => fetch(`${API}/api/tracker/status`).then(r => r.json()),
  start: () => fetch(`${API}/api/tracker/start`, { method: 'POST' }),
  stop: () => fetch(`${API}/api/tracker/stop`, { method: 'POST' }),
  current: () => fetch(`${API}/api/tracker/current`).then(r => r.ok ? r.json() : null),
  sessions: () => fetch(`${API}/api/tracker/sessions`).then(r => r.json()),
  screenshot: () => fetch(`${API}/api/tracker/screenshot`).then(r => r.ok ? r.blob() : null),
  setInterval: (interval) => fetch(`${API}/api/tracker/interval`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ interval })
  }),
  quickRestart: () => fetch(`${API}/api/tracker/restart`, { method: 'POST' }),
  reloadConfig: () => fetch(`${API}/api/tracker/reload-config`, { method: 'POST' }),
  getRestartStatus: () => fetch(`${API}/api/tracker/status`).then(r => r.json()),
  restartWithInterval: (interval) => fetch(`${API}/api/tracker/restart-with-interval`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ interval })
  }),
  healthCheck: () => fetch(`${API}/api/tracker/health`).then(r => r.json()),
  shutdown: () => fetch(`${API}/api/tracker/shutdown`, { method: 'POST' }),
  emergencyShutdown: () => fetch(`${API}/api/tracker/emergency-shutdown`, { method: 'POST' }),
  getShutdownStatus: () => fetch(`${API}/api/tracker/shutdown-status`).then(r => r.json()),
  forceStop: () => fetch(`${API}/api/tracker/force-stop`, { method: 'POST' }),
  shutdownApp: () => fetch(`${API}/api/tracker/shutdown-app`, { method: 'POST' }),
};

export const widgets = {
  systemStats: () => fetch(`${API}/api/widgets/system_stats`).then(r => r.json()),
  setCity: (city) => fetch(`${API}/api/widgets/weather`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city })
  }),
  getWeather: () => fetch(`${API}/api/widgets/weather`).then(r => r.json()),
};

export const utils = {
  processMap: () => fetch(`${API}/api/utils/process-map`).then(r => r.json()),
  friendlyName: (exe) => fetch(`${API}/api/utils/friendly-name/${exe}`).then(r => r.json()),
  windowInfo: () => fetch(`${API}/api/utils/window-info`).then(r => r.json()),
  process: (pid) => fetch(`${API}/api/utils/process/${pid}`).then(r => r.json()),
  enumWindows: () => fetch(`${API}/api/utils/windows`).then(r => r.json()),
  system: () => fetch(`${API}/api/utils/system`).then(r => r.json()),
};

export const productivy = {
  classify: (resource) => fetch(`${API}/api/productivy/classify/${resource}`).then(r => r.json()),
  classifyBulk: (resources) => fetch(`${API}/api/productivy/classify`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resources })
  }),
  rules: () => fetch(`${API}/api/productivy/rules`).then(r => r.json()),
  addRule: (category, pattern) => fetch(`${API}/api/productivy/rules/${category}`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pattern })
  }),
  overrides: () => fetch(`${API}/api/productivy/overrides`).then(r => r.json()),
  addOverride: (resource, category) => fetch(`${API}/api/productivy/overrides`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resource, category })
  }),
  cache: () => fetch(`${API}/api/productivy/cache`).then(r => r.json()),
  clearCache: (resource) => fetch(`${API}/api/productivy/cache/${resource}`, { method: 'DELETE' }),
  stats: () => fetch(`${API}/api/productivy/stats`).then(r => r.json()),
  export: () => fetch(`${API}/api/productivy/export`).then(r => r.json()),
  importRules: (rules) => fetch(`${API}/api/productivy/import`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rules })
  }),
};

export const config = {
  getProcessMap: () => fetch(`${API}/api/config/process-map`).then(r => r.json()),
  upsertMap: (map) => fetch(`${API}/api/config/process-map`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(map)
  }),
  listCategories: () => fetch(`${API}/api/config/categories`).then(r => r.json()),
  newCategory: (name, color) => fetch(`${API}/api/config/categories`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color })
  }),
  removeCategory: (cat) => fetch(`${API}/api/config/categories/${cat}`, { method: 'DELETE' }),
  addPattern: (cat, pattern) => fetch(`${API}/api/config/categories/${cat}/patterns`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pattern })
  }),
  removePattern: (cat, pattern) => fetch(`${API}/api/config/categories/${cat}/patterns/${pattern}`, { method: 'DELETE' }),
  listPrefixes: () => fetch(`${API}/api/config/prefixes`).then(r => r.json()),
  addPrefix: (prefix) => fetch(`${API}/api/config/prefixes`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix })
  }),
  removePrefix: (prefix) => fetch(`${API}/api/config/prefixes/${prefix}`, { method: 'DELETE' }),
  listUrls: () => fetch(`${API}/api/config/urls`).then(r => r.json()),
};

export const history = {
  raw: () => fetch(`${API}/api/history/raw`).then(r => r.json()),
  sessions: () => fetch(`${API}/api/history/sessions`).then(r => r.json()),
  stats: () => fetch(`${API}/api/history/stats`).then(r => r.json()),
  summary: () => fetch(`${API}/api/history/summary`).then(r => r.json()),
  daily: () => fetch(`${API}/api/history/daily`).then(r => r.json()),
  weekly: () => fetch(`${API}/api/history/weekly`).then(r => r.json()),
  monthly: () => fetch(`${API}/api/history/monthly`).then(r => r.json()),
  cleanup: () => fetch(`${API}/api/history/cleanup`, { method: 'POST' }),
  meta: () => fetch(`${API}/api/history/meta`).then(r => r.json()),
  list_productive: () => fetch(`${API}/api/history/rankings/productive`).then(r => r.json()),
  list_distractive: () => fetch(`${API}/api/history/rankings/distracting`).then(r => r.json()),
};

export const analytics = {
  appTime: (hours) => {
    const url = new URL(`${API}/api/analytics/app-time`);
    if (hours !== undefined) {
      url.searchParams.append('hours', hours);
    }
    return fetch(url).then(r => r.json());
  },
  windowTypeTime: () => fetch(`${API}/api/analytics/window-type-time`).then(r => r.json()),
  topWindows: (n, hours) => {
    const url = new URL(`${API}/api/analytics/top-windows`);
    if (n !== undefined) {
      url.searchParams.append('n', n);
    }
    if (hours !== undefined) {
      url.searchParams.append('hours', hours);
    }
    return fetch(url).then(r => r.json());
  },
  productivitySummary: (hours) => {
    const url = new URL(`${API}/api/analytics/productivity-summary`);
    if (hours !== undefined) {
      url.searchParams.append('hours', hours);
    }
    return fetch(url).then(r => r.json());
  },
  productiveApps: (hours) => {
    const url = new URL(`${API}/api/analytics/productive-apps`);
    if (hours !== undefined) {
      url.searchParams.append('hours', hours);
    }
    return fetch(url).then(r => r.json());
  },
  distractingApps: (hours) => {
    const url = new URL(`${API}/api/analytics/distracting-apps`);
    if (hours !== undefined) {
      url.searchParams.append('hours', hours);
    }
    return fetch(url).then(r => r.json());
  },
  dailySummary: (days) => {
    const url = new URL(`${API}/api/analytics/daily-summary`);
    if (days !== undefined) {
      url.searchParams.append('days', days);
    }
    return fetch(url).then(r => r.json());
  },
  weeklySummary: (weeks) => {
    const url = new URL(`${API}/api/analytics/weekly-summary`);
    if (weeks !== undefined) {
      url.searchParams.append('weeks', weeks);
    }
    return fetch(url).then(r => r.json());
  },
  monthlySummary: (months) => {
    const url = new URL(`${API}/api/analytics/monthly-summary`);
    if (months !== undefined) {
      url.searchParams.append('months', months);
    }
    return fetch(url).then(r => r.json());
  },
};

export const capturer = {
  start: () => fetch(`${API}/api/capturer/start`, { method: 'POST' }),
  stop: () => fetch(`${API}/api/capturer/stop`, { method: 'POST' }),
  status: () => fetch(`${API}/api/capturer/status`).then(r => r.json()),
  history: () => fetch(`${API}/api/capturer/history`).then(r => r.json()),
  clearMemory: () => fetch(`${API}/api/capturer/clear-memory`, { method: 'POST' }),
  cleanStorage: () => fetch(`${API}/api/capturer/clean-storage`, { method: 'POST' }),
  download: (filename) => fetch(`${API}/api/capturer/download/${filename}`).then(r => r.blob()),
  storageInfo: () => fetch(`${API}/api/capturer/storage-info`).then(r => r.json()),
  setInterval: (interval) => fetch(`${API}/api/capturer/interval`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ interval })
  }),
};

export const device = {
  startTimer: () => fetch(`${API}/api/device/start`, { method: 'POST' }),
  stopTimer: () => fetch(`${API}/api/device/stop`, { method: 'POST' }),
  status: () => fetch(`${API}/api/device/status`).then(r => r.json()),
  history: () => fetch(`${API}/api/device/history`).then(r => r.json()),
  clearHistory: () => fetch(`${API}/api/device/history`, { method: 'DELETE' }),
  unlock: () => fetch(`${API}/api/device/unlock`, { method: 'POST' }),
  getPasscode: () => fetch(`${API}/api/device/passcode`).then(r => r.json()),
  powerAction: (action) => fetch(`${API}/api/device/power-action`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action })
  }),
  notify: (message) => fetch(`${API}/api/device/notify`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  }),
};

export const modes = {
  status: () => fetch(`${API}/api/modes/status`).then(r => r.json()),
  switch: (mode) => fetch(`${API}/api/modes/switch`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode })
  }),
  standard: () => fetch(`${API}/api/modes/standard/normal`, { method: 'POST' }),
  kids: () => fetch(`${API}/api/modes/kids`, { method: 'POST' }),
  focus: (focusType) => fetch(`${API}/api/modes/focus/${focusType}`, { method: 'POST' }),
  listModes: () => fetch(`${API}/api/modes/modes`).then(r => r.json()),
  focusModes: () => fetch(`${API}/api/modes/modes`).then(r => r.json()),
  getSettings: (modeKey) => fetch(`${API}/api/modes/settings/${modeKey}`).then(r => r.json()), // mode_key = "standard_focus_deep"  or kids or standard_normal
  updateSetting: (modeKey, setting, value) => fetch(`${API}/api/modes/settings/${modeKey}/${setting}`, { 
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value })
  }),
  startTimer: (duration) => fetch(`${API}/api/modes/timer/start`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ duration })
  }),
  stopTimer: () => fetch(`${API}/api/modes/timer/stop`, { method: 'POST' }),
  timerStatus: () => fetch(`${API}/api/modes/timer/status`).then(r => r.json()),
};

export const eTracker = {
  ping: () => fetch(`${API}/e-tracker/ping`).then(r => r.json()),
  trackUrl: (url, category) => fetch(`${API}/e-tracker/track-url`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, category })
  }),
  getStats: () => fetch(`${API}/e-tracker/stats`).then(r => r.json()),
  getUrls: () => fetch(`${API}/e-tracker/urls`).then(r => r.json()),
  exportData: () => fetch(`${API}/e-tracker/export`).then(r => r.json()),
  extensionCommand: (command) => fetch(`${API}/e-tracker/extension-command`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command })
  }),
  getCommands: () => fetch(`${API}/e-tracker/get-commands`).then(r => r.json()),
  clearCommands: () => fetch(`${API}/e-tracker/clear-commands`, { method: 'POST' }),
};

export const health = {
  check: () => fetch(`${API}/health`).then(r => r.json()),
};