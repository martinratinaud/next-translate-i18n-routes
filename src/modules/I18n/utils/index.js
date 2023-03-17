const fs = require('fs');
const path = require('path');

const listFilesRecursively = (dir) => {
  const filesAndFolders = fs.readdirSync(dir, { withFileTypes: true });

  return filesAndFolders.flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return listFilesRecursively(entryPath);
    }

    return entryPath;
  });
};

const parseJavascriptJson = (jsonString) => {
  const validJsonString = jsonString
    .replace(/(\s*[\{\},]\s*)(\w+)(\s*):/g, '$1"$2"$3:') // Add quotes around keys
    .replace(/'/g, '"') // Replace single quotes with double quotes
    .replace(/,\s*}/g, '}'); // Remove trailing commas

  try {
    const jsonObj = JSON.parse(validJsonString);
    return jsonObj;
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
};

const getPagePermalinks = () => {
  const pagePermalinks = {};
  const containingFolder = ['src', 'pages'];

  const filenames = listFilesRecursively(
    path.join(process.cwd(), ...containingFolder)
  );

  filenames.forEach((filepath) => {
    const content = fs.readFileSync(filepath).toString();

    const match = /(?<=const permalinks[^=]*= )\{[\s\S]*?\};/gm.exec(content);
    const jsonString = match && match[0].replace(';', '');

    if (jsonString) {
      const relativeFilePath = filepath.replace(
        path.join(process.cwd(), ...containingFolder),
        ''
      );

      const parsedUri = path.parse(relativeFilePath);
      const uri = `${parsedUri.dir}${
        parsedUri.name === 'index' ? '' : parsedUri.name
      }`;
      const routes = parseJavascriptJson(jsonString);

      pagePermalinks[uri] = routes;
    }
  });

  return pagePermalinks;
};

module.exports = { getPagePermalinks };
