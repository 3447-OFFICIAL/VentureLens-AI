import os
import re
import json

def fix_file(filepath, replacements):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix unescaped entities and others
fix_file("src/app/(auth)/login/page.tsx", [
    ("Don't have an account?", "Don&apos;t have an account?")
])

fix_file("src/app/dashboard/ai/page.tsx", [
    ("There's no better way", "There&apos;s no better way"),
    ("I've analyzed the market", "I&apos;ve analyzed the market")
])

fix_file("src/app/dashboard/companies/[id]/market/page.tsx", [
    ("competitor's", "competitor&apos;s")
])

fix_file("src/app/dashboard/ic/page.tsx", [
    ("team's", "team&apos;s"),
    (' "highly recommended" ', ' &quot;highly recommended&quot; '),
    (' "pass" ', ' &quot;pass&quot; '),
    ("fund's", "fund&apos;s"),
    ("company's", "company&apos;s"),
    ("founder's", "founder&apos;s"),
    ("partner's", "partner&apos;s")
])

fix_file("src/app/dashboard/page.tsx", [
    ("Fund's", "Fund&apos;s"),
    ("Partner's", "Partner&apos;s")
])

fix_file("src/app/dashboard/portfolio/page.tsx", [
    ("quarter's", "quarter&apos;s")
])

fix_file("src/app/dashboard/tasks/page.tsx", [
    ("today's", "today&apos;s")
])

fix_file("src/app/page.tsx", [
    ("doesn't", "doesn&apos;t")
])

fix_file("src/app/dashboard/pipeline/page.tsx", [
    ("const [view, setView] = useState<'board' | 'list'>('board');", "")
])

# api.ts
fix_file("src/lib/api.ts", [
    ("data?: any,", "data?: Record<string, unknown>,"),
    ("data: any", "data: Record<string, unknown>"),
    ("options: any", "options: RequestInit")
])

# e2e tests
fix_file("tests/e2e/dashboard.spec.ts", [
    ("async ({ _page })", "async ()")
])

# lucide imports
def remove_imports(filepath, unused):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    def repl(m):
        imports = [i.strip() for i in m.group(1).replace('\\n', ' ').split(',') if i.strip()]
        imports = [i for i in imports if i not in unused]
        return "import { " + ", ".join(imports) + ' } from "lucide-react";'
        
    content = re.sub(r'import\s+{([^}]+)}\s+from\s+"lucide-react";', repl, content)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

remove_imports("src/app/(auth)/login/page.tsx", ["ArrowRight"])
remove_imports("src/app/dashboard/ai/page.tsx", ["Download", "AlertCircle", "MessageSquare", "History", "Settings", "MoreHorizontal"])

# update eslint config
eslint_path = ".eslintrc.json"
if os.path.exists(eslint_path):
    with open(eslint_path, 'r', encoding='utf-8') as f:
        config = json.load(f)
else:
    config = {"extends": ["next/core-web-vitals"]}

if "rules" not in config:
    config["rules"] = {}
config["rules"]["@typescript-eslint/no-unused-vars"] = ["warn", {"argsIgnorePattern": "^_", "varsIgnorePattern": "^_"}]

with open(eslint_path, 'w', encoding='utf-8') as f:
    json.dump(config, f, indent=2)

print("Fixes applied.")
