import json
import os

# 1. Load your policies
with open("data/policies.json", "r", encoding="utf-8") as f:
    policies = json.load(f)

def chunk_text(text, chunk_size=100, overlap=20):
    """
    Splits `text` into chunks of ~chunk_size words with `overlap` words overlapping.
    Returns a list of chunk strings.
    """
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        # advance by chunk_size - overlap
        start += chunk_size - overlap
    return chunks

# 2. Build your chunk list
all_chunks = []
for policy in policies:
    pid    = policy["id"]
    dept   = policy["dept"]
    title  = policy["title"]
    text   = policy["content"]
    chunks = chunk_text(text, chunk_size=100, overlap=20)
    for idx, chunk in enumerate(chunks):
        all_chunks.append({
            "policy_id":   pid,
            "title":       title,
            "dept":        dept,
            "chunk_index": idx,
            "chunk_text":  chunk
        })

# 3. Write out to JSON
os.makedirs("data", exist_ok=True)
with open("data/policy_chunks.json", "w", encoding="utf-8") as f:
    json.dump(all_chunks, f, indent=2, ensure_ascii=False)

print(f"✅ Generated {len(all_chunks)} chunks in data/policy_chunks.json")
