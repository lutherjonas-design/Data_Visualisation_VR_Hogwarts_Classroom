FROM node:20-alpine

WORKDIR /frontend

# Install dependencies first (better caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy source (will be overridden by volume in dev)
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]