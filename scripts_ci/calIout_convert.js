const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '..', 'source', '_posts');

console.log('Starting conversion of Obsidian callouts...');

fs.readdirSync(postsDir).forEach(file => {
    if (path.extname(file) === '.md') {
        const filePath = path.join(postsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // 使用正则表达式进行更安全的替换
        // 这个正则表达式会匹配整个 callout 块
        const calloutRegex = /^> \[\!(\w+)\]\s*([\s\S]*?)(?=\n(^>|$)|\Z)/gm;

        if (calloutRegex.test(content)) {
            content = content.replace(calloutRegex, (match, type, innerContent) => {
                const style = type.toLowerCase();
                // 清理内部每一行的 '>' 符号
                const cleanedContent = innerContent.replace(/^> /gm, '').trim();
                console.log(`Converting callout [!${style}] in file: ${file}`);
                return `{% note ${style} %}\n${cleanedContent}\n{% endnote %}`;
            });

            fs.writeFileSync(filePath, content, 'utf8');
        }
    }
});

console.log('Conversion finished.');