FROM node:18

# 1. Set your working dir
WORKDIR /api

# 2. Copy only package manifests
COPY package.json package-lock.json ./

# 3. Install deps
RUN npm install

# 4. Copy the rest of your code
COPY . .

# 5. Build
RUN npm run build

EXPOSE 3000

# 6. Start
CMD ["npm", "run", "start"]
