# Use a imagem oficial do Node.js como base
FROM node:latest

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie o arquivo package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos
COPY . .

# Comando para criar a versão de produção
CMD ["npm", "start"]
