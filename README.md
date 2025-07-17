# Workflow API

A powerful API for creating and executing dynamic workflows that interact with Large Language Models (LLMs). Build complex, conditional logic flows with caching capabilities for optimal performance.

## Features

- 🔄 **Dynamic Workflow Creation**: Define multi-step workflows with conditional routing
- 🤖 **LLM Integration**: Seamless interaction with language models
- ⚡ **Caching System**: Built-in caching for improved performance and reduced API costs
- 🎯 **Conditional Logic**: Route workflow execution based on LLM responses
- 📝 **Template Variables**: Use `{{input}}` and `{{lastOutput}}` placeholders in prompts
- 🔗 **Node-based Architecture**: Connect workflow steps with flexible routing

## API Endpoints

### Create Workflow
```
POST /workflow/create
```

Creates a new workflow from a list of interconnected nodes.

**Request Body:**
```json
{
  "nodes": [
    {
      "id": "start",
      "prompt": "What is the language of this message, answer with 'french' if it is french or else 'english'?\nMessage: {{input}}",
      "condition": {
        "english": "summarize_en",
        "french": "translate_to_en"
      }
    },
    {
      "id": "summarize_en",
      "prompt": "Please summarize the following English message:\n{{lastOutput}}",
      "next": "reply"
    },
    {
      "id": "translate_to_en",
      "prompt": "Translate to English and summarize:\n{{lastOutput}}",
      "next": "summarize_en"
    },
    {
      "id": "reply",
      "prompt": "Final result: {{lastOutput}}"
    }
  ]
}
```

**Response:** `204 No Content` - Workflow created successfully

### Run Workflow
```
POST /workflow/run
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
  "result": "Thank you for your message. We appreciate your kind words!"
}
```

## Workflow Schema

Workflows are defined using a JSON schema with the following structure:

### Node Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier for the node |
| `prompt` | string | ✅ | LLM prompt template with placeholder support |
| `condition` | object | ❌ | Conditional routing based on LLM output |
| `next` | string | ❌ | Direct routing to next node |

### Routing Logic

Nodes can use three routing strategies:

1. **Conditional Routing**: Use `condition` object to route based on LLM response
   ```json
   {
     "condition": {
       "french": "translate_node",
       "english": "summarize_node"
     }
   }
   ```

2. **Direct Routing**: Use `next` property for linear flow
   ```json
   {
     "next": "next_node_id"
   }
   ```

3. **Terminal Node**: No routing properties (workflow ends)

### Template Variables

- `{{input}}`: Original workflow input
- `{{lastOutput}}`: Output from the previous node

## Example Workflows

### Language Detection & Translation
```json
{
  "nodes": [
    {
      "id": "detect_language",
      "prompt": "Detect the language of: {{input}}. Reply with 'french' or 'english' only.",
      "condition": {
        "french": "translate_to_english",
        "english": "process_english"
      }
    },
    {
      "id": "translate_to_english",
      "prompt": "Translate this French text to English: {{input}}",
      "next": "process_english"
    },
    {
      "id": "process_english",
      "prompt": "Summarize this English text professionally: {{lastOutput}}"
    }
  ]
}
```

### Customer Support Triage
```json
{
  "nodes": [
    {
      "id": "classify_intent",
      "prompt": "Classify this customer message intent as 'complaint', 'question', or 'compliment': {{input}}",
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

## Caching System

The API includes intelligent caching to:
- 🚀 **Reduce Latency**: Serve cached results instantly
- 💰 **Lower Costs**: Minimize LLM API calls
- 🔄 **Improve Reliability**: Consistent responses for identical inputs

Cache keys are generated based on:
- Node prompt template
- Input variables
- LLM model configuration

## Getting Started

1. **Create a workflow** using the `/workflow/create` endpoint
2. **Run the workflow** with your input using `/workflow/run`
3. **Monitor results** and optimize your node prompts

## Error Responses

| Status Code | Description |
|-------------|-------------|
| `400` | No workflow created yet or invalid request |
| `422` | Invalid workflow schema |
| `500` | Internal server error |

## Best Practices

- ✅ Use descriptive node IDs
- ✅ Keep prompts clear and specific
- ✅ Test conditional routing with various inputs
- ✅ Leverage caching for repeated operations
- ✅ Design workflows with error handling in mind

## Schema Validation

All workflows are validated against the [JSON Schema](workflow-schema.json) to ensure proper structure and connectivity.

---

*Built for developers who need powerful, flexible LLM workflow automation.*