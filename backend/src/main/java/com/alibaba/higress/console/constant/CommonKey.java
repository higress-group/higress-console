package com.alibaba.higress.console.constant;

import java.nio.file.Paths;

public class CommonKey {

    public final static String HIGRESS_KUBE_CONFIG_KEY = "higress-kube-config";

    public final static String HIGRESS_KUBE_CONFIG_DEFAULT_PATH = Paths.get(System.getProperty("user.home"), "/.kube/config").toString();

    public final static String HIGRESS_NS_KEY = "higress-ns";

    public final static String HIGRESS_NS_DEFAULT = "higress-system";

    public final static String HIGRESS_ISTIOD_KEY = "higress-istiod";

    public final static String HIGRESS_ISTIOD_NS_DEFAULT = "istio-system";

    public final static String HIGRESS_ISTIOD_DEFAULT = "istiod";

}
