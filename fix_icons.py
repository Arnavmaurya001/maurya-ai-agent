import re

file_path = r'c:\Users\jayag\.gemini\antigravity\scratch\coding-agent-pro\App.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define the icons to check for duplicates
icons = ['Wrench', 'Check']

for icon in icons:
    pattern = rf'const {icon} = \(props\) => \(\s+<Icon {{...props}}><.*?></Icon>\s+\);\n'
    matches = list(re.finditer(pattern, content, re.DOTALL))
    
    if len(matches) > 1:
        print(f"Found {len(matches)} occurrences of {icon}. Removing the second one...")
        # Remove the second occurrence (the one further down in the file)
        # We start from the second match
        second_match = matches[1]
        content = content[:second_match.start()] + content[second_match.end():]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Finished cleaning up App.js")
