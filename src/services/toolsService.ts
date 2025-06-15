
export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'creative' | 'research' | 'analysis' | 'productivity';
  requiresApiKey?: boolean;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: Record<string, any>;
}

export const AVAILABLE_TOOLS: Tool[] = [
  {
    id: 'image-generation',
    name: 'Create Image',
    description: 'Generate images using AI based on text descriptions',
    icon: 'image',
    category: 'creative',
    requiresApiKey: true,
    enabled: false,
    config: {
      provider: 'openai', // openai, stability, midjourney
      model: 'dall-e-3',
      size: '1024x1024'
    }
  },
  {
    id: 'web-search',
    name: 'Search Web',
    description: 'Search the internet for real-time information',
    icon: 'search',
    category: 'research',
    requiresApiKey: true,
    enabled: false,
    config: {
      provider: 'perplexity',
      maxResults: 5
    }
  },
  {
    id: 'code-executor',
    name: 'Run Code',
    description: 'Execute and preview code snippets safely',
    icon: 'code',
    category: 'productivity',
    requiresApiKey: false,
    enabled: true
  },
  {
    id: 'file-analyzer',
    name: 'Analyze Files',
    description: 'Extract insights and analyze uploaded files',
    icon: 'zap',
    category: 'analysis',
    requiresApiKey: false,
    enabled: true
  },
  {
    id: 'web-scraper',
    name: 'Extract Content',
    description: 'Extract and summarize content from web pages',
    icon: 'wrench',
    category: 'research',
    requiresApiKey: false,
    enabled: true
  }
];

class ToolsService {
  private tools: Map<string, Tool> = new Map();

  constructor() {
    this.loadTools();
  }

  private loadTools() {
    // Load tools from localStorage or use defaults
    const savedTools = localStorage.getItem('nova-tools');
    const toolsToLoad = savedTools ? JSON.parse(savedTools) : AVAILABLE_TOOLS;
    
    toolsToLoad.forEach((tool: Tool) => {
      this.tools.set(tool.id, tool);
    });
  }

  getTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  getEnabledTools(): Tool[] {
    return this.getTools().filter(tool => tool.enabled);
  }

  getTool(id: string): Tool | undefined {
    return this.tools.get(id);
  }

  updateTool(id: string, updates: Partial<Tool>) {
    const tool = this.tools.get(id);
    if (tool) {
      const updatedTool = { ...tool, ...updates };
      this.tools.set(id, updatedTool);
      this.saveTools();
    }
  }

  enableTool(id: string) {
    this.updateTool(id, { enabled: true });
  }

  disableTool(id: string) {
    this.updateTool(id, { enabled: false });
  }

  private saveTools() {
    localStorage.setItem('nova-tools', JSON.stringify(Array.from(this.tools.values())));
  }

  async executeTool(toolId: string, input: string, context?: any): Promise<ToolResult> {
    const tool = this.getTool(toolId);
    if (!tool || !tool.enabled) {
      return { success: false, error: 'Tool not found or disabled' };
    }

    try {
      switch (toolId) {
        case 'image-generation':
          return await this.executeImageGeneration(input, tool.config);
        case 'web-search':
          return await this.executeWebSearch(input, tool.config);
        case 'code-executor':
          return await this.executeCode(input);
        case 'file-analyzer':
          return await this.analyzeFile(input, context);
        case 'web-scraper':
          return await this.scrapeWebContent(input);
        default:
          return { success: false, error: 'Tool implementation not found' };
      }
    } catch (error) {
      console.error(`Error executing tool ${toolId}:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private async executeImageGeneration(prompt: string, config: any): Promise<ToolResult> {
    // Placeholder for image generation
    return {
      success: false,
      error: 'Image generation requires API key configuration'
    };
  }

  private async executeWebSearch(query: string, config: any): Promise<ToolResult> {
    // Placeholder for web search
    return {
      success: false,
      error: 'Web search requires API key configuration'
    };
  }

  private async executeCode(code: string): Promise<ToolResult> {
    try {
      // Simple JavaScript execution (unsafe - for demo only)
      const result = eval(code);
      return {
        success: true,
        data: { result: String(result), code },
        metadata: { type: 'code-execution' }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Code execution failed'
      };
    }
  }

  private async analyzeFile(content: string, context: any): Promise<ToolResult> {
    // Basic file analysis
    const analysis = {
      type: context?.file?.type || 'unknown',
      size: content.length,
      lineCount: content.split('\n').length,
      wordCount: content.split(/\s+/).length,
      summary: content.substring(0, 200) + (content.length > 200 ? '...' : '')
    };

    return {
      success: true,
      data: analysis,
      metadata: { type: 'file-analysis' }
    };
  }

  private async scrapeWebContent(url: string): Promise<ToolResult> {
    try {
      // Note: This would need a proxy service in production due to CORS
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      return {
        success: true,
        data: {
          url,
          title: data.contents.match(/<title>(.*?)<\/title>/i)?.[1] || 'No title',
          content: data.contents.substring(0, 1000) + '...'
        },
        metadata: { type: 'web-scraping' }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to scrape web content'
      };
    }
  }
}

export const toolsService = new ToolsService();
