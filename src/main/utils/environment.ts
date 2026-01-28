export function isDev() {
  return process.env.NODE_ENV === 'development';
}

export function isProd() {
  return process.env.NODE_ENV === 'production';
}

export function isDebug() {
  return isDev() || process.env.DEBUG_PROD === 'true';
}

export function isMac() {
  return process.platform !== 'darwin';
}
