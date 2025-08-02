# embed_and_index_local.py
import os
import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# 1) Load your chunks
with open("data/policy_chunks.json", "r", encoding="utf-8") as f:
    chunks = json.load(f)

# 2) Choose a pretrained model
#    all-MiniLM-L6-v2 is small (384‑d), fast, and performs well.
model = SentenceTransformer('all-MiniLM-L6-v2')
EMBED_DIM = model.get_sentence_embedding_dimension()

# 3) Initialize FAISS
index = faiss.IndexFlatL2(EMBED_DIM)
metadatas = []

# 4) Embed in batches (or one‑by‑one)
texts = [c["chunk_text"] for c in chunks]
vectors = model.encode(texts, show_progress_bar=True, convert_to_numpy=True)
index.add(vectors)

# 5) Build metadata
for c in chunks:
    metadatas.append({
        "policy_id":   c["policy_id"],
        "title":       c["title"],
        "dept":        c["dept"],
        "chunk_index": c["chunk_index"]
    })

# 6) Persist index & metadata
os.makedirs("data", exist_ok=True)
faiss.write_index(index, "data/policy_faiss_local.index")
with open("data/policy_faiss_local_meta.json", "w", encoding="utf-8") as f:
    json.dump(metadatas, f, indent=2, ensure_ascii=False)

print(f"✅ Locally embedded {len(chunks)} chunks (dim={EMBED_DIM}) and saved FAISS index")
