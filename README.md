# TaskManager

Configure as variáveis de ambiente no arquivo ```.env```

 ## Comandos Necessários: 

Cria todas as imagens via docker-composer

```docker-compose up --build```

Tentei criar as tabelas pelo dockerfile, mas não tive sucesso, então, é necessário que seja acessado o diretório do projeto criado dentro do container do backend, no docker.

Segue os comandos:

```docker exec -it <ID CONTAINER BACKEND> /bin/bash```

```cd /app```

```npx prisma migrate deploy```

Pronto, basta acessar a rota 3000 e inciar o teste de funcionamento.
