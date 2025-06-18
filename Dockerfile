FROM oven/bun:1 AS builder

WORKDIR /app

# Copiar archivos de dependencias y configuración
COPY package.json bun.lock ./

# Instalar dependencias
RUN bun install --frozen-lockfile

# Copiar código fuente
COPY . .

# Etapa de producción
FROM oven/bun:1-slim AS production

WORKDIR /app

# Copiar dependencias y código desde la etapa de construcción
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src ./src

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bunjs

# Cambiar ownership de archivos
RUN chown -R bunjs:nodejs /app
USER bunjs

# Exponer puerto
EXPOSE 3000

# Comando de ejecución
CMD ["bun", "run", "src/index.ts"]