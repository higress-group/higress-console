package com.alibaba.higress.console.constant;

import java.nio.file.Paths;

public class CommonKey {

    public final static String CONFIG_KEY_PREFIX = "higress-console.";

    public final static String KUBE_CONFIG_KEY = CONFIG_KEY_PREFIX + "kube-config";

    public final static String KUBE_CONFIG_DEFAULT_PATH = Paths.get(System.getProperty("user.home"), "/.kube/config").toString();

    public final static String NS_KEY = CONFIG_KEY_PREFIX + "ns";

    public final static String NS_DEFAULT = "higress-system";

    public final static String CONTROLLER_SERVICE_NAME_KEY = CONFIG_KEY_PREFIX + "controller.service.name";

    public final static String CONTROLLER_SERVICE_NAME_DEFAULT = "higress-controller";

    public final static String CONTROLLER_SERVICE_HOST_KEY = CONFIG_KEY_PREFIX + "controller.service.host";

    public final static String CONTROLLER_SERVICE_HOST_DEFAULT = "localhost";

    public final static String CONTROLLER_SERVICE_PORT_KEY = CONFIG_KEY_PREFIX + "controller.service.port";

    public final static int CONTROLLER_SERVICE_PORT_DEFAULT = 15014;

    public final static String CONTROLLER_ACCESS_TOKEN_KEY = CONFIG_KEY_PREFIX + "controller.access-token";

}
