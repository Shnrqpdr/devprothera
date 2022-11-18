
# Dev Prothera

Auxilia no desenvolvimento do projeto prothera com a listagem de ícones svg e manutenção do arquivo de traduções.



## Funcionalidades

- Lista todos os ícones .svg do diretório indicado.
- Lista, adiciona, atualiza e exclui traduções do arquivo.

## Tecnologias

- Node.js
- Vue 3 - CDN
- Vue-router 4 - CDN
- Bootstrap 5 - CDN
- Vue3-easy-data-table - CDN

## Como utilizar

Crie um arquivo .env seguindo o modelo (.env.example) 
indicando o caminho do diretório de ícones e do arquivo de traduções.

Execute o comando na raiz do projeto:
```bash
npm install
npm start
```


## Documentação da API

#### Retorna todos os ícones da pasta

```http
  GET /api/icones
```
```
Response: [ { svg: <NODE_HTML>, nomeArquivo: 'icone' }, ... ]
```

#### Retorna todas as traduções do arquivo

```http
  GET /api/traducoes
```
```
Response: { pt: { olaMundo: 'Olá mundo', }, ... }
```

#### Salva todas as alterações no arquivo
```http
  POST /api/traducoes
```
```
Request: [ {id: 'olaMundo', chave: 'olaMundo', pt: 'Olá Mundo', en: 'Hello World', es: 'Hola Mundo', acao: 'adicionado' }, ... ]
```
| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | O ID da tradução é a chave original que indica a mensagem no arquivo de traduções  |
| `chave`   | `string` | A chave pode ser uma nova ou a mesma que o ID |
| `pt`      | `string` | A nova mensagem em português |
| `en`      | `string` | A nova mensagem em inglês |
| `es`      | `string` | A nova mensagem em espanhol |
| `acao`      | `'excluido' \| 'adicionado' \| undefined` | Indicação de alteração da mensagem |


