import React, { useState } from 'react';
import {
  Terminal,
  Code2,
  Copy,
  Check,
  Play,
  Key,
  Shield,
  Zap,
  Globe,
  Activity,
  Server,
  Database,
  ArrowRight,
  ExternalLink,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

interface RpcMethod {
  id: string;
  name: string;
  category: 'Ledger' | 'Accounts' | 'Transactions' | 'Staking';
  description: string;
  params: Record<string, any>;
  sampleResponse: Record<string, any>;
}

const RPC_METHODS: RpcMethod[] = [
  {
    id: 'cookie_getSlot',
    name: 'cookie_getSlot',
    category: 'Ledger',
    description: 'Returns the current slot number processed by the cluster.',
    params: {
      commitment: 'finalized',
    },
    sampleResponse: {
      jsonrpc: '2.0',
      result: 284912014,
      id: 1,
    },
  },
  {
    id: 'cookie_getBlock',
    name: 'cookie_getBlock',
    category: 'Ledger',
    description: 'Returns identity and transaction information about a confirmed block in the ledger.',
    params: {
      slot: 284912014,
      encoding: 'jsonParsed',
      transactionDetails: 'signatures',
      rewards: false,
    },
    sampleResponse: {
      jsonrpc: '2.0',
      result: {
        blockHeight: 271049281,
        blockTime: 1726649520,
        blockhash: '6Vb9mQ8m5k2pPj3sL8w7nQ1zR9tY4uI0oP3aK6eD2fG1',
        parentSlot: 284912013,
        previousBlockhash: 'Bq7f9HkYVz3P2NmC6wLa4xQ8eR1tJ0sD4fG7hJ9kL2m1',
        signatures: ['5K2p...3m9n', '8Qw4...1p0s', '2Vb7...6tY9'],
        transactionsCount: 142,
      },
      id: 1,
    },
  },
  {
    id: 'cookie_getBalance',
    name: 'cookie_getBalance',
    category: 'Accounts',
    description: 'Returns the balance of the account specified by public key in COOKIE lamports.',
    params: {
      pubkey: '0x3210bc948a284617492048593820485928374819',
      commitment: 'confirmed',
    },
    sampleResponse: {
      jsonrpc: '2.0',
      result: {
        context: { slot: 284912014 },
        value: 12450000000000,
      },
      id: 1,
    },
  },
  {
    id: 'cookie_getTransaction',
    name: 'cookie_getTransaction',
    category: 'Transactions',
    description: 'Returns transaction details for a confirmed transaction signature.',
    params: {
      signature: '5K2p8Qw4Vb7tY9uI0oP3aK6eD2fG1hJ4mN7qS0vW3zX6yC9bE2rT5uI8oP1aK4e',
      commitment: 'finalized',
      maxSupportedTransactionVersion: 0,
    },
    sampleResponse: {
      jsonrpc: '2.0',
      result: {
        slot: 284912014,
        blockTime: 1726649520,
        meta: {
          err: null,
          fee: 5000,
          computeUnitsConsumed: 32410,
          status: { Ok: null },
        },
        transaction: {
          signatures: ['5K2p8Qw4Vb7t...'],
          message: {
            accountKeys: ['0x3210bc...4819', '0x9b04fc...3d12'],
            recentBlockhash: '6Vb9mQ8m5k2p...',
          },
        },
      },
      id: 1,
    },
  },
  {
    id: 'cookie_simulateTransaction',
    name: 'cookie_simulateTransaction',
    category: 'Transactions',
    description: 'Simulates sending a transaction and returns the result without broadcasting to the network.',
    params: {
      transaction: 'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA...',
      sigVerify: false,
    },
    sampleResponse: {
      jsonrpc: '2.0',
      result: {
        context: { slot: 284912014 },
        value: {
          err: null,
          logs: [
            'Program CookSwapRouter1111111111 invoke [1]',
            'Program log: Instruction: exactInputSingle',
            'Program log: Swapped 100 COOK for 50 TOKEN',
            'Program CookSwapRouter1111111111 success',
          ],
          unitsConsumed: 28150,
          returnData: null,
        },
      },
      id: 1,
    },
  },
];

export const ApiView: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('https://rpc.cookiechain.io/v1');
  const [selectedMethod, setSelectedMethod] = useState<RpcMethod>(RPC_METHODS[0]);
  const [activeCodeLang, setActiveCodeLang] = useState<'curl' | 'ts' | 'python' | 'rust'>('curl');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Playground state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customParams, setCustomParams] = useState<string>(
    JSON.stringify(RPC_METHODS[0].params, null, 2)
  );
  const [responsePayload, setResponsePayload] = useState<any>(RPC_METHODS[0].sampleResponse);
  const [responseTime, setResponseTime] = useState<number>(24);

  // API Key modal simulation
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [generatedApiKey, setGeneratedApiKey] = useState<string>('');

  const handleMethodChange = (method: RpcMethod) => {
    setSelectedMethod(method);
    setCustomParams(JSON.stringify(method.params, null, 2));
    setResponsePayload(method.sampleResponse);
  };

  const handleRunRequest = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResponseTime(Math.floor(Math.random() * 25) + 15);
      try {
        const parsed = JSON.parse(customParams);
        setResponsePayload({
          jsonrpc: '2.0',
          id: 1,
          result: {
            ...selectedMethod.sampleResponse.result,
            _queriedParams: parsed,
            _timestamp: Date.now(),
          },
        });
      } catch {
        setResponsePayload(selectedMethod.sampleResponse);
      }
    }, 450);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateKey = () => {
    const key = `ck_live_${Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;
    setGeneratedApiKey(key);
    setApiKeyModalOpen(true);
  };

  const getCodeSnippet = () => {
    const paramsStr = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: selectedMethod.name,
      params: [selectedMethod.params],
    });

    if (activeCodeLang === 'curl') {
      return `curl -X POST ${selectedEndpoint} \\
  -H "Content-Type: application/json" \\
  -d '${paramsStr}'`;
    }

    if (activeCodeLang === 'ts') {
      return `import { CookieConnection } from "@cookie-chain/web3";

const connection = new CookieConnection("${selectedEndpoint}");

async function run() {
  const result = await connection.rpcRequest("${selectedMethod.name}", [
    ${JSON.stringify(selectedMethod.params, null, 4)}
  ]);
  console.log("RPC Result:", result);
}

run();`;
    }

    if (activeCodeLang === 'python') {
      return `import requests

url = "${selectedEndpoint}"
payload = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "${selectedMethod.name}",
    "params": [${JSON.stringify(selectedMethod.params)}]
}

response = requests.post(url, json=payload).json()
print("Result:", response["result"])`;
    }

    if (activeCodeLang === 'rust') {
      return `use cookie_client::RpcClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = RpcClient::new("${selectedEndpoint}".to_string());
    let res = client.send_json_rpc("${selectedMethod.name}", serde_json::json!([${JSON.stringify(selectedMethod.params)}])).await?;
    println!("Response: {:?}", res);
    Ok(())
}`;
    }

    return '';
  };

  return (
    <div className="w-full bg-black min-h-screen text-zinc-200 font-sans pb-16">
      {/* Header section */}
      <section className="border-b border-[#27272a] bg-black py-10 px-4">
        <div className="w-full max-w-[1380px] mx-auto space-y-4">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#09090b] text-white border border-[#27272a]">
              DEVELOPER PROTOCOL APIS
            </span>
            <span className="text-zinc-500 font-mono text-xs">• High-Throughput SVM JSON-RPC 2.0</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                <Terminal className="w-8 h-8 text-white" />
                RPC & Developer APIs
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
                Interact with the Cookie Chain public node infrastructure. Query validated blocks,
                stream WebSocket mempool events, and simulate parallel SVM smart contract executions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerateKey}
                className="px-4 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-sm font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>Get Free API Key</span>
              </button>
            </div>
          </div>

          {/* Endpoint Selector Bar */}
          <div className="mt-6 bg-[#09090b] border border-[#27272a] rounded-xl p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase text-zinc-400">Endpoint:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { label: 'Public RPC', url: 'https://rpc.cookiechain.io/v1' },
                  { label: 'WebSocket WS', url: 'wss://ws.cookiechain.io/v1' },
                  { label: 'GraphQL Indexer', url: 'https://graphql.cookiechain.io/v1' },
                ].map((ep) => (
                  <button
                    key={ep.url}
                    onClick={() => setSelectedEndpoint(ep.url)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer border ${
                      selectedEndpoint === ep.url
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-black text-zinc-400 border-[#27272a] hover:text-white'
                    }`}
                  >
                    {ep.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 bg-black px-3 py-1.5 rounded-lg border border-[#27272a] font-mono text-xs">
              <span className="text-white flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                99.99% Uptime
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-300 truncate">{selectedEndpoint}</span>
              <button
                onClick={() => handleCopy(selectedEndpoint, 'ep-url')}
                className="text-zinc-400 hover:text-white ml-1 cursor-pointer"
                title="Copy endpoint"
              >
                {copiedId === 'ep-url' ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="w-full max-w-[1380px] mx-auto px-4 mt-8 space-y-8">
        {/* Interactive Playground Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Method List Sidebar */}
          <div className="lg:col-span-4 bg-[#09090b] border border-[#27272a] rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
              <span className="text-xs font-mono uppercase text-zinc-400 font-bold flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-white" />
                RPC Methods
              </span>
              <span className="text-[11px] font-mono text-white bg-black border border-[#27272a] px-2 py-0.5 rounded font-bold">
                JSON-RPC 2.0
              </span>
            </div>

            <div className="space-y-1.5">
              {RPC_METHODS.map((m) => {
                const isSelected = selectedMethod.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleMethodChange(m)}
                    className={`w-full text-left p-3 rounded-lg transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#18181b] border-white shadow-sm'
                        : 'bg-black/60 border-transparent hover:bg-[#18181b]/60 hover:border-[#27272a]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-mono text-xs font-bold ${
                          isSelected ? 'text-white' : 'text-zinc-300'
                        }`}
                      >
                        {m.name}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-black border border-[#27272a] text-zinc-400">
                        {m.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-snug">
                      {m.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Playground & Console */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#09090b] border border-[#27272a] rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#27272a]">
                <div>
                  <h3 className="text-white text-base font-bold font-mono flex items-center gap-2">
                    <span className="text-white bg-black px-1.5 py-0.5 rounded border border-[#27272a] text-xs">POST</span>
                    <span>{selectedMethod.name}</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{selectedMethod.description}</p>
                </div>

                <button
                  onClick={handleRunRequest}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span>{isLoading ? 'Executing...' : 'Test Request'}</span>
                </button>
              </div>

              {/* Request Parameters Editor */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Request Parameters (JSON):
                </label>
                <textarea
                  value={customParams}
                  onChange={(e) => setCustomParams(e.target.value)}
                  rows={4}
                  className="w-full bg-black p-3 rounded-lg font-mono text-xs text-white border border-[#27272a] focus:outline-none focus:border-white scrollbar-thin"
                />
              </div>

              {/* Response Viewer */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                      Response Output
                    </label>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-white border border-[#27272a] font-bold">
                      200 OK
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {responseTime}ms latency
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(JSON.stringify(responsePayload, null, 2), 'res-body')}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono cursor-pointer"
                  >
                    {copiedId === 'res-body' ? (
                      <Check className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy</span>
                  </button>
                </div>

                <pre className="bg-black p-4 rounded-lg font-mono text-xs text-zinc-300 overflow-x-auto max-h-[260px] border border-[#27272a] leading-relaxed scrollbar-thin">
                  <code>{JSON.stringify(responsePayload, null, 2)}</code>
                </pre>
              </div>
            </div>

            {/* Code Snippets Section */}
            <div className="bg-[#09090b] border border-[#27272a] rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-white" />
                  <span className="text-xs font-mono uppercase text-zinc-300 font-bold">
                    Integration Code Snippet
                  </span>
                </div>

                {/* Language Switcher */}
                <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-[#27272a]">
                  {[
                    { id: 'curl', label: 'cURL' },
                    { id: 'ts', label: 'TypeScript' },
                    { id: 'python', label: 'Python' },
                    { id: 'rust', label: 'Rust' },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setActiveCodeLang(lang.id as any)}
                      className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                        activeCodeLang === lang.id
                          ? 'bg-white text-black font-bold'
                          : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <pre className="bg-black p-4 rounded-lg font-mono text-xs text-zinc-300 overflow-x-auto border border-[#27272a] leading-relaxed">
                  <code>{getCodeSnippet()}</code>
                </pre>
                <button
                  onClick={() => handleCopy(getCodeSnippet(), 'code-snippet')}
                  className="absolute right-3 top-3 px-2 py-1 rounded bg-[#18181b] hover:bg-[#27272a] text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1 border border-[#27272a] cursor-pointer"
                >
                  {copiedId === 'code-snippet' ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Limits & Access Tiers */}
        <section className="bg-[#09090b] border border-[#27272a] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-white" />
            <h3 className="text-white text-lg font-bold">RPC Rate Limits & Access Tiers</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black p-5 rounded-xl border border-[#27272a] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-300">Public Community</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18181b] text-zinc-400 border border-[#27272a]">
                  No Key Needed
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-white">50 req/sec</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Suitable for client wallets, personal explorers, and prototype scripts.
              </p>
            </div>

            <div className="bg-black p-5 rounded-xl border border-white relative space-y-2">
              <div className="absolute -top-2.5 right-4 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                Recommended
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white">Developer Tier</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-black font-bold">
                  Free Key
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-white">500 req/sec</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Ideal for production dApps, decentralized exchanges, and high-frequency indexers.
              </p>
            </div>

            <div className="bg-black p-5 rounded-xl border border-[#27272a] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-300">Dedicated Node</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18181b] text-zinc-400 border border-[#27272a]">
                  Enterprise
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-white">Unlimited</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Dedicated non-rate-limited validator node peering with priority mempool stream.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Free API Key Generation Modal */}
      {apiKeyModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09090b] border border-[#27272a] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-black border border-[#27272a] flex items-center justify-center text-white">
                  <Key className="w-4 h-4" />
                </div>
                <h3 className="text-white font-bold text-lg">Your Free Developer API Key</h3>
              </div>
              <button
                onClick={() => setApiKeyModalOpen(false)}
                className="text-zinc-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Your key unlocks 500 requests/sec with global multi-region CDN failover. Keep this token
              confidential.
            </p>

            <div className="bg-black p-3 rounded-lg border border-[#27272a] flex items-center justify-between font-mono text-xs text-white">
              <span className="truncate mr-2">{generatedApiKey}</span>
              <button
                onClick={() => handleCopy(generatedApiKey, 'modal-key')}
                className="text-zinc-400 hover:text-white shrink-0 p-1 cursor-pointer"
                title="Copy Key"
              >
                {copiedId === 'modal-key' ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="bg-black p-3 rounded-lg text-xs text-zinc-400 space-y-1 border border-[#27272a]">
              <div className="font-bold text-white">How to authenticate:</div>
              <div className="font-mono text-[11px] text-zinc-300">
                Authorization: Bearer {generatedApiKey.slice(0, 16)}...
              </div>
              <div className="font-mono text-[11px] text-zinc-300">
                https://rpc.cookiechain.io/v1?key={generatedApiKey.slice(0, 16)}...
              </div>
            </div>

            <button
              onClick={() => setApiKeyModalOpen(false)}
              className="w-full py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-sm transition-colors cursor-pointer"
            >
              Done &amp; Copy Key
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
