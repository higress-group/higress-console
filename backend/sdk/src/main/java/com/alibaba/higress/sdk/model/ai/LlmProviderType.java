/*
 * Copyright (c) 2022-2023 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
package com.alibaba.higress.sdk.model.ai;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "LLM Service Provider Types", type = "string",
    allowableValues = {"qwen", "openai", "moonshot", "azure", "ai360", "github", "groq", "baichuan", "yi", "deepseek",
        "zhipuai", "ollama", "claude", "baidu", "hunyuan", "stepfun", "minimax", "cloudflare", "spark", "gemini",
        "deepl", "mistral", "cohere", "doubao", "coze", "together-ai", "openrouter", "grok"})
public final class LlmProviderType {

    private LlmProviderType() {}

    public static final String QWEN = "qwen";

    public static final String OPENAI = "openai";

    public static final String MOONSHOT = "moonshot";

    public static final String AZURE = "azure";

    public static final String AI360 = "ai360";

    public static final String GITHUB = "github";

    public static final String GROQ = "groq";

    public static final String BAICHUAN = "baichuan";

    public static final String YI = "yi";

    public static final String DEEPSEEK = "deepseek";

    public static final String ZHIPUAI = "zhipuai";

    public static final String OLLAMA = "ollama";

    public static final String CLAUDE = "claude";

    public static final String BAIDU = "baidu";

    public static final String HUNYUAN = "hunyuan";

    public static final String STEPFUN = "stepfun";

    public static final String MINIMAX = "minimax";

    public static final String CLOUDFLARE = "cloudflare";

    public static final String SPARK = "spark";

    public static final String GEMINI = "gemini";

    public static final String DEEPL = "deepl";

    public static final String MISTRAL = "mistral";

    public static final String COHERE = "cohere";

    public static final String DOUBAO = "doubao";

    public static final String COZE = "coze";

    public static final String TOGETHER_AI = "together-ai";

    public static final String BEDROCK = "bedrock";

    public static final String VERTEX = "vertex";

    public static final String OPENROUTER = "openrouter";

    public static final String GROK = "grok";
}
