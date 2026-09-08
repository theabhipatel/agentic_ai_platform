import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";

const LOG_DIR = "./logs";
const LOG_FILE = `${LOG_DIR}/openrouter-calls.json`;

let requestId = 0;

async function saveCall(request: unknown, response: unknown) {
    await mkdir(LOG_DIR, { recursive: true });

    let calls: unknown[] = [];

    try {
        calls = JSON.parse(await readFile(LOG_FILE, "utf8"));
    } catch {
        calls = [];
    }

    calls.push({
        requestId: ++requestId,
        request,
        response,
    });

    await writeFile(
        LOG_FILE,
        JSON.stringify(calls, null, 2),
        "utf8"
    );
}

const originalFetch = globalThis.fetch;

globalThis.fetch = async (input, init) => {
    const url =
        typeof input === "string"
            ? input
            : input instanceof URL
                ? input.toString()
                : input.url;

    // Only log OpenRouter requests
    if (!url.includes("openrouter.ai")) {
        return originalFetch(input, init);
    }

    // Exact request body
    let requestBody: unknown = null;

    if (init?.body) {
        try {
            requestBody = JSON.parse(String(init.body));
        } catch {
            requestBody = String(init.body);
        }
    }

    // Make actual request
    const response = await originalFetch(input, init);

    // Exact response body without consuming original response
    const responseText = await response.clone().text();

    let responseBody: unknown;

    try {
        responseBody = JSON.parse(responseText);
    } catch {
        responseBody = responseText;
    }

    await saveCall(requestBody, responseBody);

    return response;
};