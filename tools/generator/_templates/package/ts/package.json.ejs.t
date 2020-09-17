---
to: <%= cwd %>/../../<%=category%>/<%=package%>/package.json
---
{
  "name": "@<%=category%>/<%=package%>",
  "version": "1.0.0",
  "description": "",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "browser": "dist/index.umd.js",
  "files": [
    "dist"
  ],
  "types": "types/main.d.ts",
  "scripts": {
    "build": "rollup -c",
    "build:watch": "rollup -c -w",
    "test": "echo \"WARNING : No test specified\" && exit 0"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
  },
  "devDependencies": {
    "rollup": "~2.27.0",
    "typescript": "~4.0.2",
    "@rollup/plugin-commonjs": "15.0.0",
    "@rollup/plugin-node-resolve": "9.0.0",
    "rollup-plugin-typescript2": "0.27.2"
  }
}
