# 1. Use Python 3.10 to support the "str | None" syntax
FROM python:3.10-slim

# 2. Set environment variables
# PREVENTS Python from buffering stdout/stderr (logs appear immediately)
ENV PYTHONUNBUFFERED=1

# 3. Set work directory
WORKDIR /app

# 4. Install dependencies
# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy the rest of the application code
COPY . .

# 6. Expose the port (Cloud Run expects 8080)
EXPOSE 8080

# 7. Start the application
# Host 0.0.0.0 is CRITICAL for Cloud Run (localhost/127.0.0.1 will fail)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
