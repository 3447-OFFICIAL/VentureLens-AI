import os
import re

files_to_fix = [
    "src/app/dashboard/companies/[id]/dd/page.tsx",
    "src/app/dashboard/companies/[id]/financials/page.tsx",
    "src/app/dashboard/companies/[id]/market/page.tsx",
    "src/app/dashboard/companies/[id]/page.tsx",
    "src/app/dashboard/companies/[id]/team/page.tsx",
    "src/app/dashboard/companies/[id]/tech/page.tsx",
    "src/app/dashboard/ic/page.tsx",
    "src/app/dashboard/notifications/page.tsx",
    "src/app/dashboard/page.tsx",
    "src/app/dashboard/pipeline/page.tsx",
    "src/app/dashboard/portfolio/page.tsx",
    "src/app/dashboard/search/page.tsx",
    "src/app/dashboard/tasks/page.tsx",
    "src/app/page.tsx",
    "src/lib/api.ts",
    "tests/e2e/dashboard.spec.ts"
]

def fix_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix unescaped entities
    # A simple regex to replace ' with &apos; in JSX text, but we need to be careful.
    # We can replace don't -> don&apos;t, it's -> it&apos;s, won't -> won&apos;t, etc.
    # Actually, we can just replace ' with &apos; in known bad files based on the error output.
    # But it's easier to just do common ones.
    content = content.replace("don't", "don&apos;t")
    content = content.replace("doesn't", "doesn&apos;t")
    content = content.replace("It's", "It&apos;s")
    content = content.replace("it's", "it&apos;s")
    content = content.replace("let's", "let&apos;s")
    content = content.replace("Let's", "Let&apos;s")
    content = content.replace("We're", "We&apos;re")
    content = content.replace("we're", "we&apos;re")
    content = content.replace("They're", "They&apos;re")
    content = content.replace("they're", "they&apos;re")
    content = content.replace("You're", "You&apos;re")
    content = content.replace("you're", "you&apos;re")
    content = content.replace("haven't", "haven&apos;t")
    content = content.replace("hasn't", "hasn&apos;t")
    content = content.replace("didn't", "didn&apos;t")
    content = content.replace("isn't", "isn&apos;t")
    content = content.replace("aren't", "aren&apos;t")
    content = content.replace("won't", "won&apos;t")
    content = content.replace("wouldn't", "wouldn&apos;t")
    content = content.replace("couldn't", "couldn&apos;t")
    content = content.replace("shouldn't", "shouldn&apos;t")
    content = content.replace("can't", "can&apos;t")
    content = content.replace("fund's", "fund&apos;s")
    content = content.replace("company's", "company&apos;s")
    content = content.replace("startup's", "startup&apos;s")
    content = content.replace(' "highly recommended"', ' &quot;highly recommended&quot;')
    content = content.replace(' "pass"', ' &quot;pass&quot;')
    
    # 2. Fix api.ts types
    if "api.ts" in filepath:
        content = content.replace("data?: any", "data?: Record<string, unknown>")
        content = content.replace("body: data as any", "body: data as BodyInit")
        content = content.replace("options?: any", "options?: RequestInit")

    # 3. Fix unused page param in dashboard.spec.ts
    if "dashboard.spec.ts" in filepath:
        content = content.replace("async ({ page })", "async ({ page: _page })")

    # 4. Remove unused imports in lucide-react
    # To do this safely, we will extract the lucide-react import block and remove unused
    unused_icons = {
        "src/app/dashboard/companies/[id]/dd/page.tsx": ["ChevronRight", "Activity"],
        "src/app/dashboard/companies/[id]/financials/page.tsx": ["DollarSign", "Activity", "AlertCircle", "LineChart"],
        "src/app/dashboard/companies/[id]/market/page.tsx": ["Users2", "DollarSign", "Shield", "Minus"],
        "src/app/dashboard/companies/[id]/page.tsx": ["TrendingUp", "Search", "ExternalLink", "CheckCircle2"],
        "src/app/dashboard/companies/[id]/team/page.tsx": ["Users"],
        "src/app/dashboard/companies/[id]/tech/page.tsx": ["CheckCircle2", "Zap", "Activity"],
        "src/app/dashboard/ic/page.tsx": ["CheckCircle2", "XCircle", "ChevronRight", "MoreVertical"],
        "src/app/dashboard/notifications/page.tsx": ["Check", "Settings", "Circle"],
        "src/app/dashboard/pipeline/page.tsx": ["Paperclip", "Users", "Clock"],
        "src/app/dashboard/search/page.tsx": ["FileText", "Filter", "FolderOpen"],
        "src/app/dashboard/tasks/page.tsx": ["Clock", "ChevronDown", "AlertTriangle"],
        "src/app/page.tsx": ["Zap"]
    }
    
    missing_icons = {
        "src/app/dashboard/companies/[id]/market/page.tsx": ["AlertTriangle"],
        "src/app/dashboard/companies/[id]/team/page.tsx": ["AlertCircle", "CheckCircle2"],
        "src/app/dashboard/notifications/page.tsx": ["Users"]
    }

    # Helper to clean up imports
    if filepath in unused_icons or filepath in missing_icons:
        def replace_lucide(match):
            imports = match.group(1).replace('\n', ' ').split(',')
            imports = [i.strip() for i in imports if i.strip()]
            
            if filepath in unused_icons:
                imports = [i for i in imports if i not in unused_icons[filepath]]
            if filepath in missing_icons:
                imports.extend(missing_icons[filepath])
            
            imports = list(dict.fromkeys(imports)) # unique
            return "import { " + ", ".join(imports) + ' } from "lucide-react";'

        content = re.sub(r'import\s+{([^}]+)}\s+from\s+"lucide-react";', replace_lucide, content)
        
    # 5. Fix unused params
    content = content.replace("({ params }: { params: { id: string } })", "({ params: _params }: { params: { id: string } })")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for f in files_to_fix:
    fix_file(f)

print("Done")
