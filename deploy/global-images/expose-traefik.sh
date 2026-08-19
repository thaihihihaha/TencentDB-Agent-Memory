#!/usr/bin/env bash
# Đưa panel (8125) + proxy (8096) ra cùng một domain Traefik,
# sau mb-local (chỉ IP văn phòng).
# Chạy trong workspace này vì docker bị cách ly — container chỉ tới được qua *.b.matbao.ai.
# An toàn tạo lại: mọi trạng thái nằm trong named volume.
set -euo pipefail
cd "$(dirname "$0")"
set -a; source .env; set +a

DOMAIN="tencentdb.b.matbao.ai"
NET=tdai-memory-stack
GKEY="${MEMORY_CORE_GATEWAY_API_KEY:-local}"

panel_labels() {
  echo "--label traefik.enable=true \
	--label traefik.docker.network=mb-edge \
	--label traefik.http.routers.tdai-panel.rule=Host(\`$DOMAIN\`) \
	--label traefik.http.routers.tdai-panel.priority=1 \
	--label traefik.http.routers.tdai-panel.entrypoints=websecure \
	--label traefik.http.routers.tdai-panel.middlewares=mb-local@file \
	--label traefik.http.routers.tdai-panel.tls=true \
	--label traefik.http.routers.tdai-panel.tls.certresolver=le \
	--label traefik.http.services.tdai-panel.loadbalancer.server.port=8125"
}

proxy_labels() {
  # Proxy giữ nguyên prefix mà từng agent client sử dụng. Router có priority
  # cao hơn panel để các request này không rơi vào giao diện quản trị.
  # Không chèn space vào rule: output của hàm được word-split khi đưa vào
  # `docker run`, nên mỗi label phải luôn là một argument duy nhất.
  local proxy_paths='PathPrefix(`/claude-code`)||PathPrefix(`/codex`)||PathPrefix(`/codebuddy`)||PathPrefix(`/workbuddy`)||PathPrefix(`/dsh`)||PathPrefix(`/hermes`)||PathPrefix(`/openclaw`)||PathPrefix(`/proxy`)||PathPrefix(`/skill-bridge`)||PathPrefix(`/memory-bridge`)||PathPrefix(`/v3/session`)||PathPrefix(`/v3/admin/rate-limits`)||Path(`/whoami`)'
  echo "--label traefik.enable=true \
	--label traefik.docker.network=mb-edge \
	--label traefik.http.routers.tdai-proxy.rule=Host(\`$DOMAIN\`)&&($proxy_paths) \
	--label traefik.http.routers.tdai-proxy.priority=100 \
	--label traefik.http.routers.tdai-proxy.entrypoints=websecure \
	--label traefik.http.routers.tdai-proxy.middlewares=mb-local@file \
	--label traefik.http.routers.tdai-proxy.tls=true \
	--label traefik.http.routers.tdai-proxy.tls.certresolver=le \
	--label traefik.http.services.tdai-proxy.loadbalancer.server.port=8096"
}

echo "==> tao lai memory-hub (panel) kem Traefik"
docker rm -f tdai-memory-hub >/dev/null 2>&1 || true
docker run -d --name tdai-memory-hub --network "$NET" --network-alias memory-hub \
  -v tdai-panel-data:/data/knowledge \
  -e PANEL_PORT=8125 -e KNOWLEDGE_PORT=8424 \
  -e KNOWLEDGE_PUBLIC_BASE_URL="${KNOWLEDGE_PUBLIC_BASE_URL:-http://host.docker.internal:8424/v3}" \
  -e REMOTE_INSTANCE_ID=default -e REMOTE_INSTANCE_NAME=default \
  -e REMOTE_INSTANCE_URL="http://memory-core:8420" \
  -e REMOTE_INSTANCE_KEY="$GKEY" \
  -e REMOTE_INSTANCE_PROXY_URL="https://${DOMAIN}" \
  -e LLM_MODE=custom -e LLM_PROTOCOL="${MEMORY_LLM_PROTOCOL:-openai}" \
  -e LLM_API_KEY="$MEMORY_LLM_API_KEY" -e LLM_BASE_URL="$MEMORY_LLM_BASE_URL" \
  -e LLM_MODEL="$MEMORY_LLM_MODEL" -e KNOWLEDGE_LLM_BINDING_SYNC=0 \
  $(panel_labels) \
  agentmemory/memory-hub:latest
docker network connect mb-edge tdai-memory-hub
echo "    OK panel -> https://${DOMAIN}"

echo "==> tao lai proxy kem Traefik (config qua named volume)"
docker rm -f tdai-proxy >/dev/null 2>&1 || true
docker volume create tdai-proxy-cfg >/dev/null
docker run --rm -i -v tdai-proxy-cfg:/cfg alpine sh -c 'cat > /cfg/config.yaml' < .proxy-config/config.yaml
docker run -d --name tdai-proxy --network "$NET" --network-alias proxy \
  -v tdai-proxy-cfg:/cfg \
  $(proxy_labels) \
  agentmemory/memory-proxy:latest --config /cfg/config.yaml
docker network connect mb-edge tdai-proxy
echo "    OK proxy -> https://${DOMAIN}/{claude-code,codex,codebuddy,...}/default"

echo ""
echo "Xong. Health:"
docker ps --filter name=tdai --format '  {{.Names}}\t{{.Status}}'
