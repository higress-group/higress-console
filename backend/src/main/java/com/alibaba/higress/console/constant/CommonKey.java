package com.alibaba.higress.console.constant;

import java.nio.file.Paths;

public class CommonKey {

    public final static String HIGRESS_KUBE_CONFIG_KEY = "higress.kube-config";

    public final static String HIGRESS_KUBE_CONFIG_DEFAULT_PATH = Paths.get(System.getProperty("user.home"), "/.kube/config").toString();

    public final static String HIGRESS_NS_KEY = "higress.ns";

    public final static String HIGRESS_NS_DEFAULT = "higress-system";

    public final static String HIGRESS_CONTROLLER_SERVICE_NAME_KEY = "higress.controller.service.name";

    public final static String HIGRESS_CONTROLLER_SERVICE_NAME_DEFAULT = "higress-controller";

    public final static String HIGRESS_CONTROLLER_SERVICE_HOST_KEY = "higress.controller.service.host";

    public final static String HIGRESS_CONTROLLER_SERVICE_HOST_DEFAULT = "localhost";

    // When deployed to a K8s cluster, Higress Controller will inject the value using corresponding environment variable.
    public final static String HIGRESS_CONTROLLER_SERVICE_PORT_KEY = "higress.controller.service.port.http.monitoring";

    public final static int HIGRESS_CONTROLLER_SERVICE_PORT_DEFAULT = 15014;

    public final static String HIGRESS_CONTROLLER_ACCESS_TOKEN_KEY = "higress.controller.access-token";

}
