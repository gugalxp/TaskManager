FROM node:latest

WORKDIR /app

# Copie package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código do aplicativo para o contêiner
COPY . .

# Instale o Prisma CLI globalmente
RUN npm install -g prisma

# Execute o comando de geração do Prisma durante o processo de construção
RUN npx prisma generate

# Exponha a porta em que o aplicativo é executado
EXPOSE 3333

# Comando para executar o aplicativo
CMD ["npm", "run", "start:dev"]
