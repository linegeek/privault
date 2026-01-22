import fs from 'fs';
import path from 'path';
import webpackPaths from '../configs/webpack.paths';

const { srcNodeModulesPath, appNodeModulesPath, erbNodeModulesPath, dllPath } =
  webpackPaths;

const dllNodeModulesPath = path.join(dllPath, 'node_modules');

if (fs.existsSync(appNodeModulesPath)) {
  if (!fs.existsSync(srcNodeModulesPath)) {
    fs.symlinkSync(appNodeModulesPath, srcNodeModulesPath, 'junction');
  }
  if (!fs.existsSync(erbNodeModulesPath)) {
    fs.symlinkSync(appNodeModulesPath, erbNodeModulesPath, 'junction');
  }
  // Also link to dll/node_modules for development builds
  if (!fs.existsSync(dllNodeModulesPath)) {
    fs.symlinkSync(appNodeModulesPath, dllNodeModulesPath, 'junction');
  }
}
