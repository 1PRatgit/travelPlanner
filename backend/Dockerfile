# slim is used to reduce image size
FROM python:3.14-slim

# Set working directory
WORKDIR /app

# ----------------------------------------------------
# 1. Install system dependencies (build tools and libpq)
# ----------------------------------------------------
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip

# ----------------------------------------------------
# 2. Install Python dependencies (including asyncpg)
# ----------------------------------------------------
RUN pip install --no-cache-dir -r requirements.txt

# ----------------------------------------------------
# 3. Clean up (Optional but recommended for slim images)
# ----------------------------------------------------
# Remove build tools after installation to reduce the final image size.

RUN apt-get purge -y --auto-remove build-essential libpq-dev

# Copy application code
COPY . .
# Expose the port the app runs on
EXPOSE 8000
# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]