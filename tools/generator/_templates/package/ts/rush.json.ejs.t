---
to: <%= cwd %>/../../rush.json
inject: true
before: "// --- Package Generator markup"
skip_if: "\"packageName\": \"<%=package%>\""
---
    },
    {
      "packageName": "@<%=category%>/<%=package%>",
      "projectFolder": "<%=category%>/<%=package%>",
      "shouldPublish": false