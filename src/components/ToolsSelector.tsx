
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toolsService, Tool } from '@/services/toolsService';
import { Wrench, Image, Search, Code, Zap, Settings } from 'lucide-react';

interface ToolsSelectorProps {
  onToolSelect: (toolId: string) => void;
  onShowToolsDialog: () => void;
  disabled?: boolean;
}

const TOOL_ICONS = {
  'image': Image,
  'search': Search,
  'code': Code,
  'zap': Zap,
  'wrench': Wrench
};

export const ToolsSelector: React.FC<ToolsSelectorProps> = ({
  onToolSelect,
  onShowToolsDialog,
  disabled
}) => {
  const [tools] = useState<Tool[]>(toolsService.getEnabledTools());

  const ToolIcon = ({ iconName }: { iconName: string }) => {
    const Icon = TOOL_ICONS[iconName as keyof typeof TOOL_ICONS] || Wrench;
    return <Icon className="h-4 w-4" />;
  };

  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          disabled={disabled}
          className="h-12 w-12"
          title="Use AI Tools"
        >
          <Wrench className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {Object.entries(groupedTools).map(([category, categoryTools]) => (
          <div key={category}>
            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground capitalize">
              {category}
            </div>
            {categoryTools.map((tool) => (
              <DropdownMenuItem
                key={tool.id}
                onClick={() => onToolSelect(tool.id)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <ToolIcon iconName={tool.icon} />
                <div className="flex-1">
                  <div className="font-medium">{tool.name}</div>
                  <div className="text-xs text-muted-foreground">{tool.description}</div>
                </div>
                {tool.requiresApiKey && (
                  <Badge variant="outline" className="text-xs">API</Badge>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </div>
        ))}
        <DropdownMenuItem onClick={onShowToolsDialog} className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Manage Tools</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
