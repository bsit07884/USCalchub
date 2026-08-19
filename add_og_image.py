import os

for root, dirs, files in os.walk('..'):
    if 'node_modules' in root or '.git' in root or 'pseo-builder' in root or 'salary-calculator' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            if 'og:image' not in content and '</head>' in content:
                content = content.replace('</head>', '<meta property="og:image" content="https://uscalchub.com/logo.png" /><meta name="twitter:image" content="https://uscalchub.com/logo.png" /></head>', 1)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Updated {filepath}')
