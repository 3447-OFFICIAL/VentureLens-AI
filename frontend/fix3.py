import os
import re

def replace_quotes_in_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find unescaped quotes in typical text segments.
    # We will just replace all instances of "won't", "don't", etc. 
    # But to be thorough for the remaining ones:
    content = content.replace("It's", "It&apos;s")
    content = content.replace("it's", "it&apos;s")
    content = content.replace("There's", "There&apos;s")
    content = content.replace("there's", "there&apos;s")
    content = content.replace("Let's", "Let&apos;s")
    content = content.replace("let's", "let&apos;s")
    content = content.replace("You've", "You&apos;ve")
    content = content.replace("you've", "you&apos;ve")
    content = content.replace("We've", "We&apos;ve")
    content = content.replace("we've", "we&apos;ve")
    content = content.replace("They've", "They&apos;ve")
    content = content.replace("they've", "they&apos;ve")
    content = content.replace("I've", "I&apos;ve")
    content = content.replace("i've", "i&apos;ve")
    content = content.replace("isn't", "isn&apos;t")
    content = content.replace("aren't", "aren&apos;t")
    content = content.replace("wasn't", "wasn&apos;t")
    content = content.replace("weren't", "weren&apos;t")
    content = content.replace("hasn't", "hasn&apos;t")
    content = content.replace("haven't", "haven&apos;t")
    content = content.replace("hadn't", "hadn&apos;t")
    content = content.replace("won't", "won&apos;t")
    content = content.replace("wouldn't", "wouldn&apos;t")
    content = content.replace("don't", "don&apos;t")
    content = content.replace("doesn't", "doesn&apos;t")
    content = content.replace("didn't", "didn&apos;t")
    content = content.replace("can't", "can&apos;t")
    content = content.replace("couldn't", "couldn&apos;t")
    content = content.replace("shouldn't", "shouldn&apos;t")
    content = content.replace("mightn't", "mightn&apos;t")
    content = content.replace("mustn't", "mustn&apos;t")
    content = content.replace("I'm", "I&apos;m")
    content = content.replace("i'm", "i&apos;m")
    
    # Possession
    content = content.replace("company's", "company&apos;s")
    content = content.replace("competitor's", "competitor&apos;s")
    content = content.replace("team's", "team&apos;s")
    content = content.replace("founder's", "founder&apos;s")
    content = content.replace("partner's", "partner&apos;s")
    content = content.replace("fund's", "fund&apos;s")
    content = content.replace("quarter's", "quarter&apos;s")
    content = content.replace("today's", "today&apos;s")
    content = content.replace("Fund's", "Fund&apos;s")
    content = content.replace("Partner's", "Partner&apos;s")
    
    # Specific ones for ic/page.tsx
    content = content.replace('"highly recommended"', '&quot;highly recommended&quot;')
    content = content.replace('"pass"', '&quot;pass&quot;')
    content = content.replace("'highly recommended'", '&apos;highly recommended&apos;')
    content = content.replace("'pass'", '&apos;pass&apos;')

    # Fix unused params
    content = content.replace("({ params: _params }: { params: { id: string } })", "()")
    content = content.replace("({ params }: { params: { id: string } })", "()")
    content = content.replace("({ params: _params }: any)", "()")
    content = content.replace("({ params }: any)", "()")
    content = content.replace("async ({ _page })", "async ({})")
    content = content.replace("async ({ page: _page })", "async ({})")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)


files = [
    "src/app/dashboard/ai/page.tsx",
    "src/app/dashboard/companies/[id]/dd/page.tsx",
    "src/app/dashboard/companies/[id]/financials/page.tsx",
    "src/app/dashboard/companies/[id]/market/page.tsx",
    "src/app/dashboard/companies/[id]/page.tsx",
    "src/app/dashboard/companies/[id]/team/page.tsx",
    "src/app/dashboard/companies/[id]/tech/page.tsx",
    "src/app/dashboard/ic/page.tsx",
    "src/app/dashboard/page.tsx",
    "src/app/dashboard/pipeline/page.tsx",
    "src/app/dashboard/portfolio/page.tsx",
    "src/app/dashboard/tasks/page.tsx",
    "src/app/page.tsx",
    "tests/e2e/dashboard.spec.ts"
]

for f in files:
    replace_quotes_in_file(f)
