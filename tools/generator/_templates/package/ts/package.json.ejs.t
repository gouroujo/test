---
to: <%= cwd %>/../../<%=category%>/<%=package%>/package.json
---
{
  "name": "@<%=category%>/<%=package%>",
  "version": "1.0.0",
  "description": "",
  "main": "dist/index.js",
  "files": [
    "dist"
  ],
  "types": "types/main.d.ts",
  "scripts": {
    "start": "echo \"INFO : Not implemented\" && exit 1",
    "build": "echo \"INFO : Not implemented\" && exit 1",
    "build:watch": "echo \"INFO : Not implemented\" && exit 1",
    "test": "echo \"WARNING : No test specified\" && exit 0"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
  },
  "devDependencies": {
    "@types/node": "^12.0.0",
    "typescript": "^4.0.0"
  }
}
