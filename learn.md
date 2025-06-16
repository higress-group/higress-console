
方法1

# 获取Kind节点容器ID
docker ps | grep kind

# 进入容器
docker exec -it <container_id> bash

# 在节点内部测试
ping host.docker.internal      # 应能ping通
没有ping cmd
curl host.docker.internal:5500 # 应能访问服务
curl 可以访问


方法2

kubectl exec -it <pod-name> -- sh
curl host.docker.internal:5500  # 方法一
curl 192.168.1.100:5500        # 方法二



查看网关日志

kubectl logs -n higress-system higress-gateway-cc684c85b-rz82t -f | cat



本地配置 mac + kind
- 参考文档 https://higress.cn/docs/latest/user/quickstart/?spm=36971b57.2ef5001f.0.0.2a932c1fWVoWy4#%E9%98%B6%E6%AE%B5%E4%BA%8C%E9%85%8D%E7%BD%AE


需要有docker dameon 且启动的


higress- constant要改的 CONTROLLER_SERVICE_PORT_DEFAULT

sh build

sh start.sh --local