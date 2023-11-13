# TaskManager - Guia de Instalação e Configuração

Certifique-se de ter todas as dependências instaladas para o correto funcionamento do projeto.

### Instalação das Dependências

Execute o seguinte comando para instalar todas as dependências necessárias:

```bash
npm install
```

### Configuração de Variáveis de Ambiente

Configure as variáveis de ambiente nos arquivos `.env` do frontend e backend. Certifique-se de ajustar as configurações conforme necessário.

### Teste Local

Após a configuração do arquivo `.env` e a instalação das dependências, é recomendável realizar um teste local antes de criar as imagens no Docker.

### Criação de Imagens com Docker

Utilize o seguinte comando para criar todas as imagens via Docker Compose:

```bash
docker-compose up --build
```

### Migração de Banco de Dados

Após a execução das imagens, acesse o container do backend para realizar as migrações do banco de dados:

```bash
docker exec -it <ID CONTAINER BACKEND> /bin/bash
cd /app
npx prisma migrate deploy
```

Com esses passos, seu ambiente estará configurado e pronto para teste. Acesse a rota 3000 para verificar o funcionamento do projeto.

Observação: A tentativa de criar tabelas via Dockerfile não teve sucesso. Portanto, é necessário acessar o diretório do projeto dentro do container do backend para realizar as migrações.

Esse guia fornece instruções claras para instalação, configuração e execução do projeto. Certifique-se de seguir cada etapa para garantir um ambiente de desenvolvimento adequado.
