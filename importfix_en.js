const fs = require("fs");
const path = require("path");

// Specify the project root directory
const projectRoot = path.resolve(__dirname, "src");

// Function to traverse the entire project and execute the given callback
function traverseDirectory(dir, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Completely exclude the node_modules folder
    if (fullPath.includes("node_modules")) continue;

    if (entry.isDirectory()) {
      traverseDirectory(fullPath, callback);
    } else if (entry.isFile()) {
      callback(fullPath);
    }
  }
}

// Function to search for a specific file throughout the project
function findFileInProject(fileName) {
  let foundPath = "";
  traverseDirectory(projectRoot, (filePath) => {
    if (path.basename(filePath) === fileName) {
      foundPath = filePath;
    }
  });
  return foundPath;
}

// Analyzes the file content and fixes missing imports
function fixImports(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  const importRegex = /import .*? from ['"](.+?)['"]/g;
  let hasChanges = false;

  content = content.replace(importRegex, (match, importPath) => {
    const fileDir = path.dirname(filePath);
    const absoluteImportPath = path.resolve(fileDir, importPath);

    // If the file exists, do not modify the import statement
    if (
      fs.existsSync(absoluteImportPath) ||
      fs.existsSync(`${absoluteImportPath}.js`) ||
      fs.existsSync(`${absoluteImportPath}.jsx`)
    ) {
      return match;
    }

    // If the file does not exist, search for it in the entire project
    const fileName = path.basename(importPath);
    const foundPath = findFileInProject(fileName);

    if (foundPath) {
      const relativePath = path
        .relative(fileDir, foundPath)
        .replace(/\\/g, "/");
      hasChanges = true;
      console.log(
        `Updated import in ${filePath}: ${importPath} -> ${relativePath}`
      );
      return match.replace(importPath, `./${relativePath}`);
    } else {
      console.warn(`File not found: ${importPath} in ${filePath}`);
      return match;
    }
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content, "utf-8");
  }
}

// Traverse the project and fix import paths
traverseDirectory(projectRoot, (filePath) => {
  if (filePath.endsWith(".js") || filePath.endsWith(".jsx")) {
    fixImports(filePath);
  }
});

console.log("Missing import paths have been checked and updated!");
