Fix Import Paths Utility

This project provides a utility script for analyzing and fixing missing or incorrect import paths in a JavaScript/React project. The script recursively traverses the src directory, identifies files with broken import paths, and updates them by searching for the correct file locations within the project structure.

Features

Recursively scans the src directory of your project.

Excludes the node_modules folder to improve performance.

Analyzes import statements in .js and .jsx files.

Automatically updates incorrect or missing import paths.

Logs changes made to import paths for easy tracking.

How It Works

Traverse Directory: The script scans all files and directories under src, excluding node_modules.

Analyze Imports: It checks each file for import statements and verifies if the imported file exists.

Fix Imports: If the imported file is missing, the script searches for the file in the entire project and updates the import path to a relative path if found.

Write Changes: Updates the file with corrected import paths.

Requirements

Node.js (v12 or higher)

Basic knowledge of JavaScript/React projects

Installation

Clone this repository:

git clone https://github.com/your-username/fix-import-paths.git

Navigate to the project directory:

cd fix-import-paths

Install dependencies (if required for extensions in the future):

npm install

Usage

Place the script in the root directory of your project.

Update the projectRoot variable in the script to point to your project's src directory:

const projectRoot = path.resolve(__dirname, "src");

Run the script:

node fix-imports.js

The script will analyze and update all .js and .jsx files within your project.

Example Output

When an import path is updated:

Updated import in src/components/Button.js: ../utils/helpers -> ./utils/helpers

When a file is not found:

File not found: ../missing/file in src/components/Header.js

Contributing

Contributions are welcome! Feel free to submit issues or pull requests to enhance the functionality.

License

This project is licensed under the MIT License. See the LICENSE file for details.

Disclaimer

This script assumes a standard project structure and may not work for custom setups. Always test changes on a version-controlled project to avoid accidental overwrites.

