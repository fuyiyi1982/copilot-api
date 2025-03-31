# Copilot API

⚠️ **EDUCATIONAL PURPOSE ONLY** ⚠️
This project is a reverse-engineered implementation of the GitHub Copilot API created for educational purposes only. It is not officially supported by GitHub and should not be used in production environments.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/E1E519XS7W)

## Project Overview

A wrapper around GitHub Copilot API to make it OpenAI compatible, making it usable for other tools like AI assistants, local interfaces, and development utilities.

## Demo

https://github.com/user-attachments/assets/7654b383-669d-4eb9-b23c-06d7aefee8c5

## Prerequisites

- Bun (>= 1.2.x)
- GitHub account with Copilot subscription (Individual or Business)

## Installation

To install dependencies, run:

```sh
bun install
```

## Using with docker

Build image

```sh
docker build -t copilot-api .
```

Run the container

```sh
docker run -p 4141:4141 copilot-api
```

## Using with npx

You can run the project directly using npx:

```sh
npx copilot-api@latest
```

With options:

```sh
npx copilot-api --port 8080
```

## Command Line Options

The following command line options are available:

| Option       | Description                                  | Default | Alias |
| ------------ | -------------------------------------------- | ------- | ----- |
| --port       | Port to listen on                            | 4141    | -p    |
| --host       | Host to listen on                            | 0.0.0.0 | -h    |
| --verbose    | Enable verbose logging                       | false   | -v    |
| --business   | Use a business plan GitHub account           | false   | none  |
| --manual     | Enable manual request approval               | false   | none  |
| --rate-limit | Rate limit in seconds between requests       | none    | -r    |
| --wait       | Wait instead of error when rate limit is hit | false   | -w    |
| --api-key    | Enable API Key authentication                | false   | -k    |
| --generate-key | Generate a new API Key and exit            | false   | -g    |

Example usage:

```sh
# Run on custom port with verbose logging
npx copilot-api@latest --port 8080 --verbose

# Use with a Business GitHub account
npx copilot-api@latest --business

# Enable manual approval for each request
npx copilot-api@latest --manual

# Set rate limit to 30 seconds between requests
npx copilot-api@latest --rate-limit 30

# Wait instead of error when rate limit is hit
npx copilot-api@latest --rate-limit 30 --wait

# Enable API Key authentication
npx copilot-api@latest --api-key

# Generate a new API Key and enable authentication
npx copilot-api@latest --generate-key
```

## Network Configuration

### Host and Port Settings

By default, the server listens on all network interfaces (`0.0.0.0`) and port `4141`. This means:

- The server is accessible from other devices on your network
- You can connect to it via `http://localhost:4141` from the same machine
- You can connect to it via your machine's IP address from other devices

To change these settings:

```sh
# Listen only on localhost (not accessible from other devices)
npx copilot-api --host 127.0.0.1

# Use a different port
npx copilot-api --port 8080

# Combine host and port settings
npx copilot-api --host 127.0.0.1 --port 8080
```

## API Key Authentication

For added security, you can enable API Key authentication to protect your API endpoints.

### Generating and Enabling API Keys

```sh
# Generate a new API Key (enables authentication automatically)
npx copilot-api --generate-key
# Output: API Key已生成: abcdef1234567890...

# Just enable API Key authentication (using existing key)
npx copilot-api --api-key
```

### Using API Keys with Clients

Once API Key authentication is enabled, clients must include the key in requests using either:

1. **Authorization header**:
   ```
   Authorization: Bearer YOUR_API_KEY
   ```

2. **Query parameter**:
   ```
   http://your-server:4141/models?api_key=YOUR_API_KEY
   ```

### API Key Storage

API Keys are stored in: `~/.local/share/copilot-api/api_key`

## Running from Source

The project can be run from source in several ways:

### Development Mode

```sh
bun run dev
```

### Production Mode

```sh
bun run start
```

## Usage Tips

- Consider using free models (e.g., Gemini, Mistral, Openrouter) as the `weak-model`
- Use architect mode sparingly
- Disable `yes-always` in your aider configuration
- Be mindful that Claude 3.7 thinking mode consumes more tokens
- Enable the `--manual` flag to review and approve each request before processing
- If you have a GitHub Business account with Copilot, use the `--business` flag

### Manual Request Approval

When using the `--manual` flag, the server will prompt you to approve each incoming request:

```
? Accept incoming request? › (y/N)
```

This helps you control usage and monitor requests in real-time.

## Roadmap

- [ ] Manual authentication flow
- [x] Manual request approval system
- [x] Rate limiting implementation
- [x] Token counting
- [x] Enhanced error handling and recovery
