FROM node:18-slim AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .
  
RUN pnpm run build
 
FROM node:18-slim AS runner
  
ENV NODE_ENV=production
  
WORKDIR /app
  
RUN npm install -g pnpm
  
COPY --from=builder /app ./
  
EXPOSE 3000
  
CMD ["pnpm", "start"]
  