import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Trash2, 
  Palette, 
  RefreshCw, 
  Eye, 
  EyeOff,
  Copy,
  Download,
  Upload
} from 'lucide-react';

export interface WidgetSettingsOption {
  type: 'switch' | 'input' | 'textarea' | 'color' | 'select' | 'divider' | 'button';
  key: string;
  label?: string;
  value?: any;
  options?: { label: string; value: any }[];
  onChange?: (value: any) => void;
  onClick?: () => void;
  icon?: React.ReactNode;
  description?: string;
  danger?: boolean;
}

interface WidgetSettingsPanelProps {
  widgetTitle: string;
  onDelete?: () => void;
  onRefresh?: () => void;
  onToggleVisibility?: () => void;
  onDuplicate?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  isVisible?: boolean;
  customOptions?: WidgetSettingsOption[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size?: 'sm' | 'md' | 'lg';
}

const WidgetSettingsPanel: React.FC<WidgetSettingsPanelProps> = ({
  widgetTitle,
  onDelete,
  onRefresh,
  onToggleVisibility,
  onDuplicate,
  onExport,
  onImport,
  isVisible = true,
  customOptions = [],
  position = 'top-right',
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-2 left-2';
      case 'bottom-right':
        return 'bottom-2 right-2';
      case 'bottom-left':
        return 'bottom-2 left-2';
      default:
        return 'top-2 right-2';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-6 w-6';
      case 'lg':
        return 'h-10 w-10';
      default:
        return 'h-8 w-8';
    }
  };

  const renderOption = (option: WidgetSettingsOption) => {
    switch (option.type) {
      case 'divider':
        return <Separator key={option.key} className="my-2" />;
      
      case 'switch':
        return (
          <div key={option.key} className="flex items-center justify-between space-x-2">
            <div className="flex-1">
              <Label htmlFor={option.key} className="text-sm font-medium">
                {option.label}
              </Label>
              {option.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {option.description}
                </p>
              )}
            </div>
            <Switch
              id={option.key}
              checked={option.value}
              onCheckedChange={option.onChange}
            />
          </div>
        );
      
      case 'input':
        return (
          <div key={option.key} className="space-y-2">
            <Label htmlFor={option.key} className="text-sm font-medium">
              {option.label}
            </Label>
            <Input
              id={option.key}
              value={option.value}
              onChange={(e) => option.onChange?.(e.target.value)}
              placeholder={option.description}
            />
          </div>
        );
      
      case 'textarea':
        return (
          <div key={option.key} className="space-y-2">
            <Label htmlFor={option.key} className="text-sm font-medium">
              {option.label}
            </Label>
            <Textarea
              id={option.key}
              value={option.value}
              onChange={(e) => option.onChange?.(e.target.value)}
              placeholder={option.description}
              rows={3}
            />
          </div>
        );
      
      case 'button':
        return (
          <Button
            key={option.key}
            variant={option.danger ? "destructive" : "outline"}
            size="sm"
            onClick={option.onClick}
            className="w-full justify-start"
          >
            {option.icon && <span className="mr-2">{option.icon}</span>}
            {option.label}
          </Button>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`absolute ${getPositionClasses()} z-10`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`${getSizeClasses()} p-0 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-accent opacity-60 hover:opacity-100 transition-opacity`}
          >
            <Settings className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-64 p-0" 
          align="end"
          side={position.includes('top') ? 'bottom' : 'top'}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">{widgetTitle} Settings</h3>
            </div>
            
            <div className="space-y-3">
              {/* Standard Actions */}
              <div className="space-y-2">
                {onRefresh && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    className="w-full justify-start"
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Refresh
                  </Button>
                )}
                
                {onToggleVisibility && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleVisibility}
                    className="w-full justify-start"
                  >
                    {isVisible ? (
                      <>
                        <EyeOff className="h-3 w-3 mr-2" />
                        Hide Widget
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3 mr-2" />
                        Show Widget
                      </>
                    )}
                  </Button>
                )}
                
                {onDuplicate && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDuplicate}
                    className="w-full justify-start"
                  >
                    <Copy className="h-3 w-3 mr-2" />
                    Duplicate
                  </Button>
                )}
              </div>

              {/* Custom Options */}
              {customOptions.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    {customOptions.map(renderOption)}
                  </div>
                </>
              )}

              {/* Export/Import Actions */}
              {(onExport || onImport) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    {onExport && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onExport}
                        className="w-full justify-start"
                      >
                        <Download className="h-3 w-3 mr-2" />
                        Export Settings
                      </Button>
                    )}
                    
                    {onImport && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onImport}
                        className="w-full justify-start"
                      >
                        <Upload className="h-3 w-3 mr-2" />
                        Import Settings
                      </Button>
                    )}
                  </div>
                </>
              )}

              {/* Danger Zone */}
              {onDelete && (
                <>
                  <Separator />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={onDelete}
                    className="w-full justify-start"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete Widget
                  </Button>
                </>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default WidgetSettingsPanel;