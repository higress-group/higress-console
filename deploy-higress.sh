#!/bin/bash

# Higress 部署脚本
# 用途：在新的 namespace 中快速部署 Higress

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 默认配置
NAMESPACE="${HIGRESS_NAMESPACE:-my-higress}"
RELEASE_NAME="${HIGRESS_RELEASE_NAME:-higress}"
HELM_REPO_URL="https://higress.io/helm-charts"
ENABLE_MONITORING="${HIGRESS_ENABLE_MONITORING:-false}"
STORAGE_CLASS="${HIGRESS_STORAGE_CLASS:-standard}"
SERVICE_TYPE="${HIGRESS_SERVICE_TYPE:-NodePort}"
IS_LOCAL_CLUSTER="${HIGRESS_IS_LOCAL:-true}"

# 打印信息函数
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查依赖
check_dependencies() {
    print_info "检查依赖工具..."
    
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl 未安装，请先安装 kubectl"
        exit 1
    fi
    
    if ! command -v helm &> /dev/null; then
        print_error "helm 未安装，请先安装 helm 3.0+"
        exit 1
    fi
    
    print_info "✓ kubectl 版本: $(kubectl version --client --short 2>/dev/null | grep -o 'v[0-9]\+\.[0-9]\+\.[0-9]\+' || kubectl version --client -o json | grep -o '"gitVersion":"[^"]*"' | cut -d'"' -f4)"
    print_info "✓ helm 版本: $(helm version --short)"
}

# 检查 Kubernetes 集群连接
check_cluster() {
    print_info "检查 Kubernetes 集群连接..."
    
    if ! kubectl cluster-info &> /dev/null; then
        print_error "无法连接到 Kubernetes 集群，请检查 kubeconfig 配置"
        exit 1
    fi
    
    print_info "✓ 成功连接到集群: $(kubectl config current-context)"
}

# 添加 Helm 仓库
add_helm_repo() {
    print_info "添加 Higress Helm 仓库..."
    
    if helm repo list | grep -q "higress.io"; then
        print_warn "Higress Helm 仓库已存在，更新仓库索引..."
    else
        helm repo add higress.io $HELM_REPO_URL
    fi
    
    helm repo update
    print_info "✓ Helm 仓库配置完成"
}

# 创建命名空间
create_namespace() {
    print_info "检查命名空间: $NAMESPACE"
    
    if kubectl get namespace $NAMESPACE &> /dev/null; then
        print_warn "命名空间 $NAMESPACE 已存在"
    else
        print_info "创建命名空间: $NAMESPACE"
        kubectl create namespace $NAMESPACE
    fi
    
    print_info "✓ 命名空间准备完成"
}

# 部署 Higress
deploy_higress() {
    print_info "开始部署 Higress..."
    print_info "  - Release名称: $RELEASE_NAME"
    print_info "  - 命名空间: $NAMESPACE"
    print_info "  - 服务类型: $SERVICE_TYPE"
    print_info "  - 本地集群: $IS_LOCAL_CLUSTER"
    print_info "  - 启用监控: $ENABLE_MONITORING"
    
    # 构建 helm 安装命令参数
    HELM_ARGS=(
        "$RELEASE_NAME"
        "-n" "$NAMESPACE"
        "higress.io/higress"
        "--create-namespace"
        "--render-subchart-notes"
        "--set" "global.local=$IS_LOCAL_CLUSTER"
        "--set" "higress-console.service.type=$SERVICE_TYPE"
    )
    
    # 如果启用监控，添加相关参数
    if [ "$ENABLE_MONITORING" = "true" ]; then
        print_info "启用监控组件 (Grafana + Prometheus + Loki)..."
        HELM_ARGS+=(
            "--set" "global.o11y.enabled=true"
            "--set" "higress-console.o11y.grafana.pvc.storageClassName=$STORAGE_CLASS"
            "--set" "higress-console.o11y.prometheus.pvc.storageClassName=$STORAGE_CLASS"
            "--set" "higress-console.o11y.loki.pvc.storageClassName=$STORAGE_CLASS"
        )
    fi
    
    # 执行 helm 安装
    print_info "执行 Helm 安装命令..."
    helm install "${HELM_ARGS[@]}"
    
    print_info "✓ Higress 部署命令已执行"
}

# 等待部署完成
wait_for_deployment() {
    print_info "等待 Higress 组件就绪..."
    
    # 等待 gateway pod 就绪
    print_info "等待 Higress Gateway..."
    if kubectl wait --for=condition=ready pod -l app=higress-gateway -n $NAMESPACE --timeout=300s 2>/dev/null; then
        print_info "✓ Higress Gateway 已就绪"
    else
        print_warn "Higress Gateway 未在预期时间内就绪，请手动检查"
    fi
    
    # 等待 console pod 就绪
    print_info "等待 Higress Console..."
    if kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=higress-console -n $NAMESPACE --timeout=300s 2>/dev/null; then
        print_info "✓ Higress Console 已就绪"
    else
        print_warn "Higress Console 未在预期时间内就绪，请手动检查"
    fi
}

# 显示部署状态
show_status() {
    print_info "=========================================="
    print_info "Higress 部署状态"
    print_info "=========================================="
    
    echo ""
    print_info "Pods 状态:"
    kubectl get pods -n $NAMESPACE -o wide
    
    echo ""
    print_info "Services 状态:"
    kubectl get svc -n $NAMESPACE
    
    echo ""
    print_info "IngressClass:"
    kubectl get ingressclass 2>/dev/null || print_warn "未找到 IngressClass"
    
    echo ""
}

# 显示访问信息
show_access_info() {
    print_info "=========================================="
    print_info "访问 Higress Console"
    print_info "=========================================="
    
    CONSOLE_SVC=$(kubectl get svc -n $NAMESPACE -l app.kubernetes.io/name=higress-console -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
    
    if [ -z "$CONSOLE_SVC" ]; then
        print_error "未找到 Higress Console 服务"
        return
    fi
    
    SERVICE_TYPE_ACTUAL=$(kubectl get svc $CONSOLE_SVC -n $NAMESPACE -o jsonpath='{.spec.type}')
    
    echo ""
    if [ "$SERVICE_TYPE_ACTUAL" = "NodePort" ]; then
        NODE_PORT=$(kubectl get svc $CONSOLE_SVC -n $NAMESPACE -o jsonpath='{.spec.ports[?(@.name=="http")].nodePort}')
        print_info "Console 访问地址: http://<节点IP>:$NODE_PORT"
        print_info "获取节点IP: kubectl get nodes -o wide"
    elif [ "$SERVICE_TYPE_ACTUAL" = "LoadBalancer" ]; then
        LB_IP=$(kubectl get svc $CONSOLE_SVC -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null)
        if [ -n "$LB_IP" ]; then
            print_info "Console 访问地址: http://$LB_IP:8080"
        else
            print_warn "LoadBalancer IP 尚未分配，请稍后查看"
        fi
    else
        print_info "使用端口转发访问:"
        print_info "kubectl port-forward -n $NAMESPACE svc/$CONSOLE_SVC 8080:8080"
        print_info "然后访问: http://localhost:8080"
    fi
    
    echo ""
    print_info "默认登录账号: admin"
    print_info "如需设置密码，请在 values.yaml 中配置 admin.password"
    echo ""
}

# 显示帮助信息
show_help() {
    cat << EOF
用法: $0 [选项]

选项:
  -n, --namespace NAME       指定命名空间 (默认: my-higress)
  -r, --release NAME         指定 release 名称 (默认: higress)
  -t, --service-type TYPE    服务类型: ClusterIP|NodePort|LoadBalancer (默认: NodePort)
  -m, --enable-monitoring    启用监控组件 (Grafana + Prometheus + Loki)
  -s, --storage-class CLASS  存储类名称 (默认: standard)
  -l, --local                标记为本地集群 (默认: true)
  -h, --help                 显示此帮助信息

环境变量:
  HIGRESS_NAMESPACE          命名空间
  HIGRESS_RELEASE_NAME       Release 名称
  HIGRESS_SERVICE_TYPE       服务类型
  HIGRESS_ENABLE_MONITORING  是否启用监控 (true/false)
  HIGRESS_STORAGE_CLASS      存储类名称
  HIGRESS_IS_LOCAL           是否为本地集群 (true/false)

示例:
  # 基础部署
  $0
  
  # 自定义命名空间和服务类型
  $0 -n prod-higress -t LoadBalancer
  
  # 启用监控
  $0 -m
  
  # 完整配置
  $0 -n my-higress -m -s gp2 -t NodePort

EOF
}

# 解析命令行参数
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -n|--namespace)
                NAMESPACE="$2"
                shift 2
                ;;
            -r|--release)
                RELEASE_NAME="$2"
                shift 2
                ;;
            -t|--service-type)
                SERVICE_TYPE="$2"
                shift 2
                ;;
            -m|--enable-monitoring)
                ENABLE_MONITORING="true"
                shift
                ;;
            -s|--storage-class)
                STORAGE_CLASS="$2"
                shift 2
                ;;
            -l|--local)
                IS_LOCAL_CLUSTER="true"
                shift
                ;;
            --no-local)
                IS_LOCAL_CLUSTER="false"
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                print_error "未知参数: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

# 主函数
main() {
    echo ""
    print_info "=========================================="
    print_info "Higress 部署脚本"
    print_info "=========================================="
    echo ""
    
    parse_args "$@"
    check_dependencies
    check_cluster
    add_helm_repo
    create_namespace
    deploy_higress
    wait_for_deployment
    show_status
    show_access_info
    
    print_info "=========================================="
    print_info "部署完成！"
    print_info "=========================================="
    echo ""
    print_info "常用命令:"
    print_info "  查看日志: kubectl logs -n $NAMESPACE -l app=higress-gateway"
    print_info "  卸载: helm uninstall $RELEASE_NAME -n $NAMESPACE"
    print_info "  升级: helm upgrade $RELEASE_NAME higress.io/higress -n $NAMESPACE"
    echo ""
}

# 执行主函数
main "$@"
