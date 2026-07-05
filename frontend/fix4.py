import re
import os

def fix_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')
    
    # Specific targeted lines:
    if "ai/page.tsx" in filepath:
        # replace any single quotes in text inside HTML tags
        content = re.sub(r">([^<]*?)'([^<]*?)<", r">\1&apos;\2<", content)
        content = re.sub(r">([^<]*?)'([^<]*?)<", r">\1&apos;\2<", content) # run twice for multiple

    if "market/page.tsx" in filepath:
        content = re.sub(r"founders' ", "founders&apos; ", content)
        content = re.sub(r"founder's ", "founder&apos; ", content)
        content = re.sub(r">([^<]*?)'([^<]*?)<", r">\1&apos;\2<", content)

    if "ic/page.tsx" in filepath:
        content = content.replace('"highly recommended"', '&quot;highly recommended&quot;')
        content = content.replace('"pass"', '&quot;pass&quot;')
        content = re.sub(r">([^<]*?)'([^<]*?)<", r">\1&apos;\2<", content)
        content = re.sub(r">([^<]*?)'([^<]*?)<", r">\1&apos;\2<", content)

    if "dashboard/page.tsx" in filepath:
        content = content.replace("Fund's", "Fund&apos;s")
        content = content.replace("Partner's", "Partner&apos;s")

    if "portfolio/page.tsx" in filepath:
        content = content.replace("quarter's", "quarter&apos;s")

    if "tasks/page.tsx" in filepath:
        content = content.replace("today's", "today&apos;s")

    if "app/page.tsx" in filepath:
        content = content.replace("doesn't", "doesn&apos;t")

    if "pipeline/page.tsx" in filepath:
        content = content.replace("const [view, setView] = useState<'board' | 'list'>('board');", "")
        # replace `<div className="flex gap-2 bg-zinc-900...>` where view is used?
        # we can just completely remove the 'view' unused var by removing its line.

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

files = [
    "src/app/dashboard/ai/page.tsx",
    "src/app/dashboard/companies/[id]/market/page.tsx",
    "src/app/dashboard/ic/page.tsx",
    "src/app/dashboard/page.tsx",
    "src/app/dashboard/pipeline/page.tsx",
    "src/app/dashboard/portfolio/page.tsx",
    "src/app/page.tsx"
]

for f in files:
    fix_file(f)
