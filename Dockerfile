FROM denoland/deno:2.2.9

WORKDIR /app
COPY . .
RUN deno cache server.ts

# Clean JSON array format with environment permissions
CMD ["deno", "run", "--allow-net", "--allow-read=./frontend", "--allow-env", "server.ts"]