import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const repoRoot = process.cwd();
const host = process.env.OLLAMA_HOST || 'http://host.docker.internal:11434';
const model = process.env.OLLAMA_MODEL || 'qwen2.5:7b';
const promptPath = resolve(repoRoot, process.env.OLLAMA_PROMPT_FILE || 'prompts/flight-decision-prompt.md');
const inputPath = resolve(repoRoot, process.env.OLLAMA_INPUT_FILE || 'examples/ollama-flight-request.json');

const [promptText, inputText] = await Promise.all([
    readFile(promptPath, 'utf8'),
    readFile(inputPath, 'utf8')
]);

const input = JSON.parse(inputText);
const messages = [
    { role: 'system', content: promptText.trim() },
    { role: 'user', content: JSON.stringify(input, null, 2) }
];

const response = await fetch(new URL('/api/chat', host), {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        model,
        stream: false,
        messages,
        options: {
            temperature: 0
        }
    })
});

if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama request failed: ${response.status} ${response.statusText}\n${errorText}`);
}

const payload = await response.json();
const content = payload?.message?.content ?? '';

let parsed;
try {
    parsed = JSON.parse(content);
} catch {
    parsed = {
        error: 'Ollama returned non-JSON content',
        raw: content
    };
}

console.log(JSON.stringify(parsed, null, 2));
