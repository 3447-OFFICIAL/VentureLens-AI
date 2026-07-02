# Frequently Asked Questions (FAQ) - VentureLens AI

### 1. Does VentureLens AI support local LLM execution?
Yes. By configuring `LLM_PROVIDER=local` and setting `LLM_MODEL` to your locally run model tag (e.g. `llama3` or `mistral` served via Ollama), you can run entirely offline due diligence sessions without third-party API exposure.

### 2. How is multi-tenant security isolated?
Every SQL query and vector similarity lookup in Qdrant is filtered at query-time using the user's Clerk organization ID (`tenant_id`). Cross-tenant lookups will fail with a `404 Not Found` or `403 Forbidden` response.

### 3. What file formats does LlamaParse ingest?
LlamaParse natively parses PDFs, Word Documents (`.docx`), PowerPoint Presentations (`.pptx`), and Excel sheets (`.xlsx`), and supports multi-lingual OCR extraction.

### 4. How can I seed the PostgreSQL DB?
The project seeds the database automatically at start up via [seed.py](file:///d:/GITHUB%20REPOs/VentureLens-AI/backend/app/seed.py). You can also run the seed script manually from the virtual environment:
```bash
cd backend
.\venv\Scripts\python -m app.seed
```

### 5. Does the chatbot store my conversations?
No. The RAG assistant runs in-memory streaming completions. Auditing actions are written to `audit_logs` for compliance tracking, but chat queries are not persisted to database tables by default.
