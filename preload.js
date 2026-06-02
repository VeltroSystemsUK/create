// Preload script for security
// This runs in a secure context and can access Node APIs
// It provides safe bridges between the renderer process and main process

const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  arch: process.arch,
  nodeVersion: process.versions.node,
  chromeVersion: process.versions.chrome,
});
