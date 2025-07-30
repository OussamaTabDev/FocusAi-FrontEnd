import React from 'react';
import WidgetCustomizer from '@/components/WidgetCustomizer';
import { Widget } from '../types/widgetTypes';
import { availableWidgets } from '../config/widgetConfig';

interface CustomWidgetsViewProps {
  customWidgets: Widget[];
  onAddWidget: (widget: Widget) => void;
  onRemoveWidget: (id: string) => void;
}

const CustomWidgetsView: React.FC<CustomWidgetsViewProps> = ({
  customWidgets,
  onAddWidget,
  onRemoveWidget,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Custom Widgets</h2>
        <WidgetCustomizer
          availableWidgets={availableWidgets}
          activeWidgets={customWidgets}
          onAddWidget={onAddWidget}
          onRemoveWidget={onRemoveWidget}
        />
      </div>
      
      {customWidgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customWidgets.map((widget) => {
            const WidgetComponent = widget.component;
            return (
              <div 
                key={widget.id} 
                className={`
                  ${widget.size === 'small' ? 'h-48' : widget.size === 'large' ? 'h-80' : 'h-64'}
                `}
              >
                <WidgetComponent />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No custom widgets added yet.</p>
          <WidgetCustomizer
            availableWidgets={availableWidgets}
            activeWidgets={customWidgets}
            onAddWidget={onAddWidget}
            onRemoveWidget={onRemoveWidget}
          />
        </div>
      )}
    </div>
  );
};

export default CustomWidgetsView;