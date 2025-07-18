# Workflow API

A workflow engine that orchestrates LLM-powered processing trees. Built with Deno, Hono, and Redis.

## 🚀 Features

- **🤖 LLM Integration**: Seamless OpenAI integration with configurable models
- **🔄 Dynamic Workflows**: Create complex, conditional workflows with branching logic
- **📝 Template Variables**: Support for `{{input}}` and `{{lastOutput}}` placeholders
- **🔧 Type-Safe**: Full TypeScript support with JSON Schema validation
- **🐳 Docker Ready**: Complete containerization with Docker Compose
- **⚡ Deno Runtime**: Modern JavaScript/TypeScript runtime with built-in security

## 📋 Prerequisites

- [Deno](https://deno.land/) 1.40+ 
- [Redis](https://redis.io/) (or use Docker Compose)
- OpenAI API key

## 🛠️ Installation

### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ecolier/workflow.git
   cd workflow
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   cp .env.secret.example .env.secret
   ```

3. **Configure your environment**
   ```bash
   # .env.secret
   OPENAI_API_KEY=your_openai_api_key_here
   
   # .env (optional overrides)
   OPENAI_MODEL=gpt-4
   OPENAI_TEMPERATURE=0
   CACHE_HOSTNAME=localhost
   API_PORT=8000
   ```

4. **Start Redis** (if running locally)
   ```bash
   redis-server
   ```

5. **Run the application**
   ```bash
   deno task dev
   ```

### Option 2: Docker Compose

```bash
# Development
docker compose up api # supports --watch 

# Production
docker compose -f compose.yaml -f compose.production.yaml up api
```

## 🎯 API Endpoints

### Create Workflow
```http
POST /create-workflow
Content-Type: application/json
```

Creates a new workflow from a list of interconnected nodes.

**Request Body:**
```json
{
  "nodes": [
    {
      "id": "detect_language",
      "prompt": "What is the language of this message, answer with 'french' if it is french or else 'english'?\nMessage: {{input}}",
      "condition": {
        "english": "summarize_en",
        "french": "translate_to_en"
      }
    },
    {
      "id": "summarize_en",
      "prompt": "Please summarize the following English message in a concise and professional manner:\n{{input}}",
      "next": "reply"
    },
    {
      "id": "translate_to_en",
      "prompt": "Please translate the following French message to English and then provide a brief summary:\n{{input}}",
      "next": "summarize_en"
    },
    {
      "id": "reply",
      "prompt": "User wants to adopt a friendly tone, reply to the following in a friendly manner: {{lastOutput}}"
    }
  ]
}
```

**Response:** 
- `204 No Content` - Workflow created successfully
- `400` - Malformed request (or failed validation)

### Run Workflow
```http
POST /run-workflow
Content-Type: application/json
```

Executes the most recently created workflow with the provided input.

**Request Body:**
```json
{
  "input": "Merci pour votre aide, votre service client est toujours impeccable."
}
```

**Response:**
```json
{
  "result": "Thank you so much for your kind words! We're absolutely delighted to hear that you've had such a positive experience with our customer service. Your feedback means the world to us, and we're thrilled that we could meet your expectations. We look forward to continuing to provide you with excellent service!"
}
```

## 🏗️ Workflow Structure

### Node Types

Each workflow consists of nodes with the following structure:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier for the node |
| `prompt` | string | ✅ | LLM prompt template with placeholder support |
| `condition` | object | ❌ | Conditional routing based on LLM output |
| `next` | string | ❌ | Direct routing to next node |

### Routing Strategies

1. **Conditional Routing**: Branch based on LLM response
   ```json
   {
     "condition": {
       "french": "translate_node",
       "english": "summarize_node"
     }
   }
   ```

2. **Direct Routing**: Linear progression
   ```json
   {
     "next": "next_node_id"
   }
   ```

3. **Terminal Node**: End workflow (no routing)

### Template Variables

- `{{input}}`: Original workflow input
- `{{lastOutput}}`: Output from the previous node

## 📁 Project Structure

```
workflow/
├── 🐳 Dockerfile                 # Container configuration
├── 📋 deno.json                  # Deno configuration & dependencies
├── 🚀 main.ts                    # Application entry point
├── ⚙️ config.ts                  # Environment configuration
├── 📁 routes/                    # API route handlers
│   ├── create-workflow.ts
│   └── run-workflow.ts
├── 📁 core/                      # Core workflow logic
├── 📁 schemas/                   # JSON schemas
├── 📁 examples/                  # Example workflows
│   ├── translation-workflow.json
│   └── translation-input.json
├── 📁 test-utils/               # Testing utilities
└── 🐳 compose.yaml              # Docker Compose configuration
```

## 🔧 Configuration

Environment variables can be configured in `.env` and `.env.secret`:

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | Required | Your OpenAI API key |
| `OPENAI_MODEL` | `gpt-3.5-turbo-0125` | OpenAI model to use |
| `OPENAI_TEMPERATURE` | `0.1` | Response randomness (0-1) |
| `CACHE_HOSTNAME` | `localhost` | Redis hostname |
| `API_HOSTNAME` | `localhost` | API server hostname |
| `API_PORT` | `8000` | API server port |

## 🧪 Testing

```bash
# Run all tests
deno task test

# Run specific test file
deno task test specific-test.ts
```

## 📚 Examples

### Customer Support Workflow

```json
{
  "nodes": [
    {
      "id": "classify_intent",
      "prompt": "Classify this customer message as 'complaint', 'question', or 'compliment': {{input}}",
      "condition": {
        "complaint": "handle_complaint",
        "question": "answer_question", 
        "compliment": "acknowledge_compliment"
      }
    },
    {
      "id": "handle_complaint",
      "prompt": "Generate an empathetic response to this complaint: {{input}}"
    },
    {
      "id": "answer_question", 
      "prompt": "Provide a helpful answer to this question: {{input}}"
    },
    {
      "id": "acknowledge_compliment",
      "prompt": "Write a grateful response to this compliment: {{input}}"
    }
  ]
}
```

### Multi-Language Content Processing

See `examples/translation-workflow.json` for a complete example that:
1. Detects input language
2. Translates French to English if needed
3. Summarizes the content
4. Generates a friendly response

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [Deno](https://deno.land/)
- [Hono](https://hono.dev/)
- [Redis](https://redis.io/)