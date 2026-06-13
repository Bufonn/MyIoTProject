# MyIoT Project

Aplicativo mobile de monitoramento residencial em tempo real, desenvolvido com **React Native + Expo**. Recebe dados de sensores via protocolo MQTT (simulado pelo MQTT.fx) e persiste o histórico das leituras usando **json-server**.

---

## Funcionalidades

- Monitoramento de temperatura e umidade em tempo real via gauges circulares
- Controle de luz (ligar/desligar) via MQTT
- Indicador de status de conexão com o broker
- Persistência do histórico de leituras no json-server
- Tela de histórico com todas as mensagens recebidas, ordenadas da mais recente
- Limpeza do histórico com confirmação
- Modal de erro com opção de reconexão automática

---

## Tecnologias

| Tecnologia | Função |
|---|---|
| React Native + Expo | Framework mobile |
| react_native_mqtt | Comunicação com broker MQTT |
| HiveMQ Cloud | Broker MQTT na nuvem |
| json-server | API REST local para persistência |
| ngrok | Expor o json-server para o dispositivo físico |
| MQTT.fx | Simular o ESP32 publicando nos tópicos |

---

## Estrutura do Projeto

```
myiotproject/
├── src/
│   ├── components/
│   │   ├── Gauges.js          # Medidores circulares de temperatura e umidade
│   │   ├── LightControl.js    # Botão de controle da luz
│   │   └── StatusModal.js     # Modal de erro de conexão
│   ├── screens/
│   │   └── HistoryScreen.js   # Tela de histórico de leituras
│   └── services/
│       ├── appCrud.js         # Funções de acesso ao json-server (salvar, buscar, limpar)
│       └── mqttService.js     # Classe de conexão e comunicação MQTT
├── App.js                     # Componente raiz, navegação e lógica principal
├── db.json                    # Banco de dados do json-server
├── .env                       # Variáveis de ambiente (não subir no git)
├── .env.example               # Modelo de variáveis de ambiente
└── package.json
```

---

## Pré-requisitos

- Node.js 18+
- Expo Go instalado no celular
- ngrok instalado globalmente (`npm install -g ngrok`)
- Conta no [HiveMQ Cloud](https://www.hivemq.com/mqtt-cloud-broker/) com um broker criado
- MQTT.fx instalado no computador

---

## Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/myiotproject.git
cd myiotproject

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Edite o .env com suas credenciais (veja seção abaixo)
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```dotenv
EXPO_PUBLIC_API_URL=https://SEU-NGROK.ngrok-free.app
EXPO_PUBLIC_MQTT_HOST=SEU_HOST.hivemq.cloud
EXPO_PUBLIC_MQTT_PATH=/mqtt
EXPO_PUBLIC_MQTT_PORT=8884
EXPO_PUBLIC_MQTT_USER=SEU_USUARIO
EXPO_PUBLIC_MQTT_PASS=SUA_SENHA
```

> **Atenção:** O prefixo `EXPO_PUBLIC_` é obrigatório. Sem ele, o Expo Go não expõe a variável para o app em tempo de execução.

---

## Como Rodar

### Passo 1 — Inicie o servidor e o app (Em terminais diferentes)

```bash
# Inicia o Expo
npm run start

# Inicia o json-server na porta 3000
npm run server
```


### Passo 2 — Exponha o json-server para o celular

Em outro terminal:

```bash
npm run tunnel
```

O ngrok vai gerar uma URL pública, por exemplo:
```
https://abc123.ngrok-free.app
```

Copie essa URL e cole no `.env`:
```dotenv
EXPO_PUBLIC_API_URL=https://abc123.ngrok-free.app
```

Depois reinicie o Expo (`R` no terminal do Expo).

> **Por que fazer isso?** O celular não acessa `localhost` do computador diretamente. O ngrok cria um túnel público que redireciona para a porta 3000 local.

### Passo 3 — Abra o app no celular

Escaneie o QR Code exibido pelo Expo com o aplicativo **Expo Go**.

### Passo 4 — Simule o ESP32 com MQTT.fx

Configure o MQTT.fx com as mesmas credenciais do `.env` e publique nos tópicos:

| Tópico | Valores aceitos | Exemplo |
|---|---|---|
| `casa/temp` | Número decimal | `25.4` |
| `casa/umid` | Número inteiro | `60` |
| `casa/luz` | `0` ou `1` | `1` |

---

## Tópicos MQTT

```
casa/temp   → temperatura em °C (ex: 25.4)
casa/umid   → umidade em %    (ex: 60)
casa/luz    → estado da luz   (1 = ligada, 0 = desligada)
```

---

## API do json-server

Com o servidor rodando, a API fica disponível em `http://localhost:3000`.

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/historico` | Lista todos os registros |
| `GET` | `/historico?_sort=timestamp&_order=desc` | Lista do mais recente |
| `POST` | `/historico` | Salva um novo registro |
| `DELETE` | `/historico/:id` | Remove um registro |

Exemplo de registro salvo:
```json
{
  "id": 1,
  "tipo": "temp",
  "valor": 25.4,
  "timestamp": "2025-06-01T14:32:00.000Z"
}
```

---

## Scripts Disponíveis

```bash
npm run start   # Inicia o Expo
npm run server  # Inicia o json-server na porta 3000
npm run tunnel  # Inicia o ngrok apontando para a porta 3000
```

---

## Observações

- O **MQTT.fx** e o **app** são clientes independentes do mesmo broker. O app pode ser iniciado antes ou depois do MQTT.fx sem problemas.
- Cada vez que o `npm run tunnel` é executado, o ngrok gera uma **nova URL**. Sempre atualize o `.env` e reinicie o Expo após isso.
- O arquivo `.env` não deve ser versionado. Ele já está no `.gitignore`.

## Vídeos Demonstrativos: https://youtu.be/ZgGyxCa4qq8 & https://youtu.be/HHp-Nadm33c
