
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toolsService, Tool } from '@/services/toolsService';
import { Image, Search, Code, Zap, Wrench, Settings } from 'lucide-react';

interface ToolsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TOOL_ICONS = {
  'image': Image,
  'search': Search,
  'code': Code,
  'zap': Zap,
  'wrench': Wrench
};

export const ToolsDialog: React.FC<ToolsDialogProps> = ({ open, onOpenChange }) => {
  const [tools, setTools] = useState<Tool[]>(toolsService.getTools());
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const handleToolToggle = (toolId: string, enabled: boolean) => {
    if (enabled) {
      toolsService.enableTool(toolId);
    } else {
      toolsService.disableTool(toolId);
    }
    setTools(toolsService.getTools());
  };

  const getToolsByCategory = (category: string) => {
    return tools.filter(tool => tool.category === category);
  };

  const ToolIcon = ({ iconName }: { iconName: string }) => {
    const Icon = TOOL_ICONS[iconName as keyof typeof TOOL_ICONS] || Settings;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Tools & Capabilities</DialogTitle>
          <DialogDescription>
            Enable and configure tools to enhance your AI assistant's capabilities
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="creative" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="creative">Creative</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
          </TabsList>

          <TabsContent value="creative" className="space-y-4">
            <div className="grid gap-4">
              {getToolsByCategory('creative').map((tool) => (
                <Card key={tool.id} className="relative">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                      <ToolIcon iconName={tool.icon} />
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      {tool.requiresApiKey && (
                        <Badge variant="outline" className="text-xs">API Key Required</Badge>
                      )}
                      {tool.enabled && (
                        <Badge variant="default" className="text-xs">Enabled</Badge>
                      )}
                    </div>
                    <Switch
                      checked={tool.enabled}
                      onCheckedChange={(checked) => handleToolToggle(tool.id, checked)}
                    />
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="research" className="space-y-4">
            <div className="grid gap-4">
              {getToolsByCategory('research').map((tool) => (
                <Card key={tool.id} className="relative">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                      <ToolIcon iconName={tool.icon} />
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      {tool.requiresApiKey && (
                        <Badge variant="outline" className="text-xs">API Key Required</Badge>
                      )}
                      {tool.enabled && (
                        <Badge variant="default" className="text-xs">Enabled</Badge>
                      )}
                    </div>
                    <Switch
                      checked={tool.enabled}
                      onCheckedChange={(checked) => handleToolToggle(tool.id, checked)}
                    />
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid gap-4">
              {getToolsByCategory('analysis').map((tool) => (
                <Card key={tool.id} className="relative">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                      <ToolIcon iconName={tool.icon} />
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      {tool.requiresApiKey && (
                        <Badge variant="outline" className="text-xs">API Key Required</Badge>
                      )}
                      {tool.enabled && (
                        <Badge variant="default" className="text-xs">Enabled</Badge>
                      )}
                    </div>
                    <Switch
                      checked={tool.enabled}
                      onCheckedChange={(checked) => handleToolToggle(tool.id, checked)}
                    />
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="productivity" className="space-y-4">
            <div className="grid gap-4">
              {getToolsByCategory('productivity').map((tool) => (
                <Card key={tool.id} className="relative">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                      <ToolIcon iconName={tool.icon} />
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      {tool.requiresApiKey && (
                        <Badge variant="outline" className="text-xs">API Key Required</Badge>
                      )}
                      {tool.enabled && (
                        <Badge variant="default" className="text-xs">Enabled</Badge>
                      )}
                    </div>
                    <Switch
                      checked={tool.enabled}
                      onCheckedChange={(checked) => handleToolToggle(tool.id, checked)}
                    />
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
