package com.alibaba.higress.sdk.model.ai;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * LLM服务提供者类型常量类
 * 定义了支持的LLM服务提供者类型常量
 */
@Schema(description = "LLM Service Provider Types", type = "string",
    allowableValues = {"qwen", "openai", "moonshot", "azure", "ai360", "github", "groq", "baichuan", "yi", "deepseek",
        "zhipuai", "ollama", "claude", "baidu", "hunyuan", "stepfun", "minimax", "cloudflare", "spark", "gemini",
        "deepl", "mistral", "cohere", "doubao", "coze", "together-ai", "openrouter", "grok"})
public final class LlmProviderType {

    /**
     * 私有构造函数
     * 防止实例化该常量类
     */
    private LlmProviderType() {}

    /**
     * 通义千问
     * 阿里云通义千问大模型服务
     */
    public static final String QWEN = "qwen";

    /**
     * OpenAI
     * OpenAI大模型服务
     */
    public static final String OPENAI = "openai";

    /**
     * Moonshot
     * Moonshot大模型服务
     */
    public static final String MOONSHOT = "moonshot";

    /**
     * Azure
     * 微软Azure大模型服务
     */
    public static final String AZURE = "azure";

    /**
     * 360智脑
     * 360智脑大模型服务
     */
    public static final String AI360 = "ai360";

    /**
     * GitHub
     * GitHub大模型服务
     */
    public static final String GITHUB = "github";

    /**
     * Groq
     * Groq大模型服务
     */
    public static final String GROQ = "groq";

    /**
     * 百川
     * 百川大模型服务
     */
    public static final String BAICHUAN = "baichuan";

    /**
     * 零一万物
     * 零一万物大模型服务
     */
    public static final String YI = "yi";

    /**
     * DeepSeek
     * DeepSeek大模型服务
     */
    public static final String DEEPSEEK = "deepseek";

    /**
     * 智谱AI
     * 智谱AI大模型服务
     */
    public static final String ZHIPUAI = "zhipuai";

    /**
     * Ollama
     * Ollama大模型服务
     */
    public static final String OLLAMA = "ollama";

    /**
     * Claude
     * Claude大模型服务
     */
    public static final String CLAUDE = "claude";

    /**
     * 百度
     * 百度大模型服务
     */
    public static final String BAIDU = "baidu";

    /**
     * 腾讯混元
     * 腾讯混元大模型服务
     */
    public static final String HUNYUAN = "hunyuan";

    /**
     * 阶跃星辰
     * 阶跃星辰大模型服务
     */
    public static final String STEPFUN = "stepfun";

    /**
     * Minimax
     * Minimax大模型服务
     */
    public static final String MINIMAX = "minimax";

    /**
     * Cloudflare
     * Cloudflare大模型服务
     */
    public static final String CLOUDFLARE = "cloudflare";

    /**
     * 讯飞星火
     * 讯飞星火大模型服务
     */
    public static final String SPARK = "spark";

    /**
     * Gemini
     * Gemini大模型服务
     */
    public static final String GEMINI = "gemini";

    /**
     * DeepL
     * DeepL大模型服务
     */
    public static final String DEEPL = "deepl";

    /**
     * Mistral
     * Mistral大模型服务
     */
    public static final String MISTRAL = "mistral";

    /**
     * Cohere
     * Cohere大模型服务
     */
    public static final String COHERE = "cohere";

    /**
     * 豆包
     * 豆包大模型服务
     */
    public static final String DOUBAO = "doubao";

    /**
     * 扣子
     * 扣子大模型服务
     */
    public static final String COZE = "coze";

    /**
     * Together AI
     * Together AI大模型服务
     */
    public static final String TOGETHER_AI = "together-ai";

    /**
     * Bedrock
     * Bedrock大模型服务
     */
    public static final String BEDROCK = "bedrock";

    /**
     * Vertex
     * Vertex大模型服务
     */
    public static final String VERTEX = "vertex";

    /**
     * OpenRouter
     * OpenRouter大模型服务
     */
    public static final String OPENROUTER = "openrouter";

    /**
     * Grok
     * Grok大模型服务
     */
    public static final String GROK = "grok";
}
