with open("assets/css/style.css", "r", encoding="utf-8") as f:
    lines = f.readlines()
    print(f"Total lines: {len(lines)}")
    for i in range(1855, 1865):
        if i < len(lines):
            print(f"Line {i+1}: {repr(lines[i])}")
