# Backend Boleto
Queremos poder através da aplicação consultar linhas digitáveis de boleto de título bancário
e pagamento de concessionárias, verificando se a mesma é válida ou não. Sendo válida e
possuindo valor e/ou data de vencimento ter o retorno desses dados.
Utilizando o método GET o backend deverá ser acessado dessa forma: http://localhost:8080/boleto/xxxxxx
## Execução via docker
Você deve clonar o repositório `git clone https://github.com/itallocastro/backend-boleto.git`
<br>
<br>
Depois você deve acessar a pasta do projeto e rodar: `docker-compose up`
<br>
<br>
Por fim, a api estará disponível em localhost:8080

## Rodar localmente
### Requisitos:
- Node version: 18.x.x

Você deve clonar o repositório `git clone https://github.com/itallocastro/teste-backend.git`
<br>
Depois você deve acessar a pasta do projeto e rodar: `npm install`
<br>
Por fim, rodar o comando `npm start`. Com isso a api estará disponível em localhost:8080
