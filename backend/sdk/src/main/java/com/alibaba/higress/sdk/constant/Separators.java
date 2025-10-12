package com.alibaba.higress.sdk.constant;

/**
 * 分隔符常量类
 * 定义了系统中常用的分隔符字符常量，用于字符串处理和配置解析
 */
public class Separators {

    /**
     * 列表配置分隔符
     * 用于分隔配置项中的多个值，如 "value1;value2;value3"
     */
    public static final String LIST_CONFIG_SEPARATOR = ";";

    /**
     * 短横线分隔符
     * 用于构建名称、标识符等的分隔符，如 "prefix-suffix"
     */
    public static final String DASH = "-";

    /**
     * 星号分隔符
     * 通常用于通配符匹配或特殊标识
     */
    public static final String ASTERISK = "*";

    /**
     * 点号分隔符
     * 用于域名、包名、属性路径等的分隔，如 "com.example.package"
     */
    public static final String DOT = ".";

    /**
     * 逗号分隔符
     * 用于分隔列表项或参数，如 "item1,item2,item3"
     */
    public static final String COMMA = ",";

    /**
     * 等号分隔符
     * 用于键值对的分隔，如 "key=value"
     */
    public static final String EQUALS_SIGN = "=";

    /**
     * 换行符分隔符
     * 用于文本换行处理
     */
    public static final String NEW_LINE = "\n";

    /**
     * 空格分隔符
     * 用于文本中的空格分隔
     */
    public static final String SPACE = " ";

    /**
     * 下划线分隔符
     * 用于构建名称或标识符，如 "prefix_suffix"
     */
    public static final String UNDERSCORE = "_";

    /**
     * 冒号分隔符
     * 用于时间、比例或其他需要冒号分隔的场景，如 "12:30" 或 "key:value"
     */
    public static final String COLON = ":";
}
