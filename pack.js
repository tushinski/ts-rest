const path = require('path');
const fs = require('fs');

const getAbsPath = (relativePath) => path.resolve(__dirname, relativePath);

const paths = {
    package: './package',
    build: './build'
};

const filesToPack = [
    './build',
    './LICENSE',
    './package.json',
    './package-lock.json',
    './README.md',
];

console.log('\n\nCrating package...');

Object.entries(paths)
    .forEach(([key, relativePath]) => paths[key] = getAbsPath(relativePath));

if (!fs.existsSync(paths.build)) {
    console.error('[ERROR] Build directory doesn\'t exits.');
    return;
}

if (!fs.existsSync(paths.package)) {
    fs.mkdirSync(paths.package);
}

filesToPack.forEach(file => {
    const filepath = getAbsPath(file);
    const filename = path.basename(file);

    if (fs.statSync(filepath).isDirectory()) {
        console.log(`- Copying directory "${filepath}"`);
        fs.cpSync(filepath + '/', paths.package + '/', { recursive: true });
    } else {
        console.log(`- Copying file "${filepath}"`);
        fs.copyFileSync(filepath, path.join(paths.package, filename));
    }
});

console.log('Package created!');