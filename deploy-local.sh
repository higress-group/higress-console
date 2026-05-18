#!/bin/bash

# Higress 本地代码快速部署脚本
# 用途：将本地修改的前后端代码构建并部署到 Kubernetes 集群

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 默认配置
NAMESPACE="${HIGRESS_NAMESPACE:-liyongjie-higress}"
RELEASE_NAME="${HIGRESS_RELEASE_NAME:-higress}"
IMAGE_TAG=""
IMAGE_NAME=""
BUILD_BACKEND="${BUILD_BACKEND:-true}"
BUILD_FRONTEND="${BUILD_FRONTEND:-true}"
SKIP_BUILD="${SKIP_BUILD:-false}"

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

print_step() {
    echo -e "\n${BLUE}[STEP]${NC} $1"
}

# 显示帮助信息
show_help() {
    cat << EOF
用法: $0 [选项]

选项:
  -n, --namespace NAME       指定命名空间 (默认: liyongjie-higress)
  -t, --tag TAG              Docker 镜像标签 (默认: local-时间戳)
  --no-backend               跳过后端构建
  --no-frontend              跳过前端构建
  --skip-build               跳过构建，直接使用已有镜像
  -h, --help                 显示此帮助信息

环境变量:
  HIGRESS_NAMESPACE          命名空间
  HIGRESS_IMAGE_TAG          镜像标签
  BUILD_BACKEND              是否构建后端 (true/false)
  BUILD_FRONTEND             是否构建前端 (true/false)
  SKIP_BUILD                 跳过构建 (true/false)

示例:
  # 完整构建并部署
  $0
  
  # 只构建后端
  $0 --no-frontend
  
  # 只构建前端
  $0 --no-backend
  
  # 使用自定义标签
  $0 -t my-test-v1
  
  # 跳过构建，直接更新部署
  $0 --skip-build

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
            -t|--tag)
                IMAGE_TAG="$2"
                shift 2
                ;;
            --no-backend)
                BUILD_BACKEND="false"
                shift
                ;;
            --no-frontend)
                BUILD_FRONTEND="false"
                shift
                ;;
            --skip-build)
                SKIP_BUILD="true"
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
    
    # 如果未指定标签，使用默认值
    if [ -z "$IMAGE_TAG" ]; then
        IMAGE_TAG="${HIGRESS_IMAGE_TAG:-local-$(date +%Y%m%d%H%M%S)}"
    fi
    IMAGE_NAME="higress-console:${IMAGE_TAG}"
}

# 设置 Java 环境
setup_java_env() {
    if [ -z "$JAVA_HOME" ]; then
        print_warn "JAVA_HOME 未设置，尝试自动检测..."
        if command -v /usr/libexec/java_home &> /dev/null; then
            export JAVA_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null || /usr/libexec/java_home 2>/dev/null)
            print_info "自动设置 JAVA_HOME: $JAVA_HOME"
        fi
    fi
    
    if [ -n "$JAVA_HOME" ] && [ ! -x "$JAVA_HOME/bin/java" ]; then
        print_warn "JAVA_HOME 路径无效: $JAVA_HOME"
        print_warn "重新检测 Java 路径..."
        if command -v /usr/libexec/java_home &> /dev/null; then
            export JAVA_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null || /usr/libexec/java_home 2>/dev/null)
            print_info "修正后的 JAVA_HOME: $JAVA_HOME"
        fi
    fi
    
    if [ -n "$JAVA_HOME" ]; then
        print_info "✓ JAVA_HOME: $JAVA_HOME"
        print_info "✓ Java 版本: $(java -version 2>&1 | head -n 1)"
    else
        print_error "无法找到 Java，请安装 JDK 17+ 或设置 JAVA_HOME"
        exit 1
    fi
}

# 检查依赖
check_dependencies() {
    print_step "检查依赖工具..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl 未安装，请先安装 kubectl"
        exit 1
    fi
    
    if [ "$SKIP_BUILD" = "false" ]; then
        if ! command -v mvn &> /dev/null; then
            print_error "Maven 未安装，请先安装 Maven"
            exit 1
        fi
        
        if ! command -v node &> /dev/null; then
            print_warn "Node.js 未找到，将使用 frontend-maven-plugin 自动安装"
        fi
    fi
    
    print_info "✓ Docker 版本: $(docker --version)"
    print_info "✓ kubectl 版本: $(kubectl version --client --short 2>/dev/null | grep -o 'v[0-9]\+\.[0-9]\+\.[0-9]\+' || echo 'unknown')"
    if [ "$SKIP_BUILD" = "false" ]; then
        print_info "✓ Maven 版本: $(mvn --version | head -n 1)"
    fi
}

# 构建后端和前端
build_application() {
    if [ "$SKIP_BUILD" = "true" ]; then
        print_warn "跳过构建步骤"
        return
    fi
    
    print_step "构建 Higress Console..."
    
    cd "$(dirname "$0")/backend"
    
    if [ "$BUILD_BACKEND" = "true" ] && [ "$BUILD_FRONTEND" = "true" ]; then
        print_info "构建后端 + 前端..."
        ./mvnw clean package -Dmaven.test.skip=true -Dpmd.language=en
    elif [ "$BUILD_BACKEND" = "true" ]; then
        print_info "只构建后端（跳过前端）..."
        ./mvnw clean package -Dmaven.test.skip=true -Dpmd.language=en -Dskip.npm=true -Dskip.npx=true
    elif [ "$BUILD_FRONTEND" = "true" ]; then
        print_info "只构建前端..."
        cd ../frontend
        npm install
        npm run build
        cd ../backend
        # 复制前端构建产物
        cp -r ../frontend/build console/src/main/resources/static/ 2>/dev/null || true
    fi
    
    print_info "✓ 构建完成"
    cd ..
}

# 构建 Docker 镜像
build_docker_image() {
    if [ "$SKIP_BUILD" = "true" ]; then
        print_warn "跳过镜像构建"
        return
    fi
    
    print_step "构建 Docker 镜像: ${IMAGE_NAME}"
    
    cd backend
    docker build -t ${IMAGE_NAME} -f Dockerfile .
    cd ..
    
    print_info "✓ Docker 镜像构建完成: ${IMAGE_NAME}"
}

# 加载镜像到集群节点（针对 kind/minikube 等本地集群）
load_image_to_cluster() {
    print_step "加载镜像到集群..."
    
    # 检测集群类型
    CLUSTER_TYPE=""
    if kubectl config current-context | grep -q "kind"; then
        CLUSTER_TYPE="kind"
    elif kubectl config current-context | grep -q "minikube"; then
        CLUSTER_TYPE="minikube"
    fi
    
    if [ "$CLUSTER_TYPE" = "kind" ]; then
        print_info "检测到 Kind 集群，加载镜像..."
        kind load docker-image ${IMAGE_NAME} 2>/dev/null || {
            print_warn "kind 命令不可用或加载失败，尝试其他方式..."
        }
    elif [ "$CLUSTER_TYPE" = "minikube" ]; then
        print_info "检测到 Minikube 集群，加载镜像..."
        minikube image load ${IMAGE_NAME} 2>/dev/null || {
            print_warn "minikube 命令不可用或加载失败"
        }
    else
        print_info "标准 Kubernetes 集群，确保镜像可访问..."
        print_warn "如果是远程集群，需要先将镜像推送到镜像仓库"
        print_warn "或者在每个节点上手动加载镜像"
    fi
    
    print_info "✓ 镜像加载完成"
}

# 更新 Kubernetes 部署
update_deployment() {
    print_step "更新 Kubernetes 部署..."
    
    # 获取当前的 deployment 名称
    DEPLOYMENT_NAME=$(kubectl get deployment -n ${NAMESPACE} -l app.kubernetes.io/name=higress-console -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
    
    if [ -z "$DEPLOYMENT_NAME" ]; then
        print_error "未找到 Higress Console Deployment"
        print_error "请确认命名空间是否正确: ${NAMESPACE}"
        exit 1
    fi
    
    print_info "找到 Deployment: ${DEPLOYMENT_NAME}"
    
    # 更新镜像
    print_info "更新镜像为: ${IMAGE_NAME}"
    kubectl set image deployment/${DEPLOYMENT_NAME} -n ${NAMESPACE} \
        higress-console=${IMAGE_NAME}
    
    print_info "✓ 部署更新命令已执行"
}

# 等待新 Pod 就绪
wait_for_rollout() {
    print_step "等待新 Pod 就绪..."
    
    DEPLOYMENT_NAME=$(kubectl get deployment -n ${NAMESPACE} -l app.kubernetes.io/name=higress-console -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
    
    if [ -z "$DEPLOYMENT_NAME" ]; then
        print_error "未找到 Deployment"
        exit 1
    fi
    
    print_info "等待 rollout 完成..."
    if kubectl rollout status deployment/${DEPLOYMENT_NAME} -n ${NAMESPACE} --timeout=300s; then
        print_info "✓ 新 Pod 已就绪"
    else
        print_error "Rollout 超时，请检查 Pod 状态"
        kubectl get pods -n ${NAMESPACE} -l app.kubernetes.io/name=higress-console
        exit 1
    fi
}

# 显示部署状态
show_status() {
    print_step "部署状态"
    
    echo ""
    print_info "Pods 状态:"
    kubectl get pods -n ${NAMESPACE} -l app.kubernetes.io/name=higress-console -o wide
    
    echo ""
    print_info "Deployment 状态:"
    kubectl get deployment -n ${NAMESPACE} -l app.kubernetes.io/name=higress-console
    
    echo ""
    print_info "最新的事件:"
    kubectl get events -n ${NAMESPACE} --field-selector involvedObject.kind=Pod --sort-by='.lastTimestamp' | tail -n 5
}

# 查看日志
show_logs() {
    print_step "查看最新 Pod 日志..."
    
    POD_NAME=$(kubectl get pods -n ${NAMESPACE} -l app.kubernetes.io/name=higress-console -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
    
    if [ -n "$POD_NAME" ]; then
        print_info "Pod: ${POD_NAME}"
        echo ""
        kubectl logs -n ${NAMESPACE} ${POD_NAME} --tail=50
    fi
}

# 主函数
main() {
    parse_args "$@"
    
    echo ""
    print_info "=========================================="
    print_info "Higress 本地代码快速部署"
    print_info "=========================================="
    print_info "命名空间: ${NAMESPACE}"
    print_info "镜像标签: ${IMAGE_TAG}"
    print_info "镜像名称: ${IMAGE_NAME}"
    print_info "构建后端: ${BUILD_BACKEND}"
    print_info "构建前端: ${BUILD_FRONTEND}"
    print_info "跳过构建: ${SKIP_BUILD}"
    echo ""
    
    setup_java_env
    check_dependencies
    build_application
    build_docker_image
    load_image_to_cluster
    update_deployment
    wait_for_rollout
    show_status
    
    echo ""
    print_info "=========================================="
    print_info "部署完成！"
    print_info "=========================================="
    echo ""
    print_info "访问地址: http://localhost:8080 (通过 port-forward)"
    echo ""
    print_info "常用命令:"
    print_info "  查看日志: kubectl logs -n ${NAMESPACE} -l app.kubernetes.io/name=higress-console -f"
    print_info "  回滚: kubectl rollout undo deployment -n ${NAMESPACE} -l app.kubernetes.io/name=higress-console"
    echo ""
    
    # 询问是否查看日志
    read -p "是否查看最新日志？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        show_logs
    fi
}

# 执行主函数
main "$@"
