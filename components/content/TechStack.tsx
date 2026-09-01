import {
  AnthropicIcon,
  DockerIcon,
  FastAPIIcon,
  GeminiIcon,
  GoogleCloudIcon,
  GrafanaIcon,
  HuggingFaceIcon,
  N8nIcon,
  OpenAIIcon,
  PostgreSQLIcon,
  PrometheusIcon,
  PythonIcon,
  RedisIcon,
  ScikitLearnIcon,
  SQLAlchemyIcon,
} from "@/components/ui/brand-icons";

const STACK = [
  { label: "FastAPI", Icon: FastAPIIcon },
  { label: "SQLAlchemy / Alembic", Icon: SQLAlchemyIcon },
  { label: "PostgreSQL (Neon)", Icon: PostgreSQLIcon },
  { label: "Redis (Upstash)", Icon: RedisIcon },
  { label: "scikit-learn", Icon: ScikitLearnIcon },
  { label: "Hugging Face (sentence-transformers)", Icon: HuggingFaceIcon },
  { label: "Prometheus", Icon: PrometheusIcon },
  { label: "Grafana", Icon: GrafanaIcon },
  { label: "Docker", Icon: DockerIcon },
  { label: "Google Cloud Run", Icon: GoogleCloudIcon },
  { label: "OpenAI gpt-5.4-nano", Icon: OpenAIIcon },
  { label: "Google Gemini 3.1 Flash-Lite", Icon: GeminiIcon },
  { label: "Anthropic Claude Sonnet 5", Icon: AnthropicIcon },
  { label: "Python", Icon: PythonIcon },
  { label: "n8n (v1)", Icon: N8nIcon },
];

export default function TechStack() {
  return (
    <div className="flex flex-wrap gap-2">
      {STACK.map(({ label, Icon }) => (
        <span
          key={label}
          className="material-trim flex items-center gap-1.5 rounded-[var(--r-sm)] px-2.5 py-1.5 font-mono text-xs text-[var(--ink-500)]"
        >
          <Icon className="h-4 w-auto" />
          {label}
        </span>
      ))}
    </div>
  );
}
