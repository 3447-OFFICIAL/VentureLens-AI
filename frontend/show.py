def show(fp, line):
    with open(fp, 'r', encoding='utf-8') as f:
        lines = f.read().split('\n')
        print(f"{fp}:{line} -> {lines[line-1]}")

show("src/app/dashboard/ic/page.tsx", 161)
show("src/app/dashboard/page.tsx", 16)
show("src/app/dashboard/pipeline/page.tsx", 7)
show("src/app/dashboard/portfolio/page.tsx", 227)
show("src/app/page.tsx", 129)
