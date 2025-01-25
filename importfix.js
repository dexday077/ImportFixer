const fs = require("fs");
const path = require("path");

// Proje ana klasörünü belirtin
const projectRoot = path.resolve(__dirname, "src");

// Tüm projeyi tarayan ve verilen callback'i çalıştıran bir fonksiyon
function traverseDirectory(dir, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // node_modules klasörünü tamamen hariç tut
    if (fullPath.includes("node_modules")) continue;

    if (entry.isDirectory()) {
      traverseDirectory(fullPath, callback);
    } else if (entry.isFile()) {
      callback(fullPath);
    }
  }
}

// Belirtilen dosyayı tüm projede arayan bir fonksiyon
function findFileInProject(fileName) {
  let foundPath = "";
  traverseDirectory(projectRoot, (filePath) => {
    if (path.basename(filePath) === fileName) {
      foundPath = filePath;
    }
  });
  return foundPath;
}

// Dosya içeriğini analiz eder ve eksik importları düzeltir
function fixImports(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  const importRegex = /import .*? from ['"](.+?)['"]/g;
  let hasChanges = false;

  content = content.replace(importRegex, (match, importPath) => {
    const fileDir = path.dirname(filePath);
    const absoluteImportPath = path.resolve(fileDir, importPath);

    // Eğer dosya mevcutsa, import ifadesine dokunma
    if (
      fs.existsSync(absoluteImportPath) ||
      fs.existsSync(`${absoluteImportPath}.js`) ||
      fs.existsSync(`${absoluteImportPath}.jsx`)
    ) {
      return match;
    }

    // Dosya mevcut değilse, tüm projede ara
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
      console.warn(`Dosya bulunamadı: ${importPath} in ${filePath}`);
      return match;
    }
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content, "utf-8");
  }
}

// Projeyi tarayın ve import yollarını düzeltin
traverseDirectory(projectRoot, (filePath) => {
  if (filePath.endsWith(".js") || filePath.endsWith(".jsx")) {
    fixImports(filePath);
  }
});

console.log("Eksik import yolları kontrol edildi ve güncellendi!");
