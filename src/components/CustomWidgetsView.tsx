import React, { useState } from 'react';
import { Grid3X3, Columns } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
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
  const [isMasonry, setIsMasonry] = useState(true);
  const [columns, setColumns] = useState(3);

  const getColumnClass = () => {
    if (isMasonry) {
      const columnMap = {
        1: 'columns-1',
        2: 'columns-1 sm:columns-2',
        3: 'columns-1 sm:columns-2 md:columns-3',
        4: 'columns-1 sm:columns-2 md:columns-3 lg:columns-4',
        5: 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5'
      };
      return columnMap[columns as keyof typeof columnMap];
    } else {
      const gridMap = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
      };
      return `grid ${gridMap[columns as keyof typeof gridMap]}`;
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Custom Widgets</h2>
        
        <div className="flex items-center gap-4">
          {/* Column Count */}
          <div className="flex items-center gap-3">
            {/* <span className="text-sm text-gray-600 dark:text-gray-400">Columns:</span> */}
            <div className="flex items-center gap-3">
              {/* <span className="text-xs text-muted-foreground w-2">5</span> */}
              {/* <div className="ml-2 min-w-[20px] text-center">
                <span className="text-sm font-medium text-foreground bg-muted px-2 py-1 rounded">
                  {columns}
                </span>
              </div> */}
              {/* <span className="text-xs text-muted-foreground w-2">1</span> */}
              <Slider
                value={[columns]}
                onValueChange={(value) => setColumns(value[0])}
                max={5}
                min={1}
                step={1}
                className="w-20"
              />
            </div>
          </div>
          {/* Layout Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setIsMasonry(false)}
              className={`p-2 rounded-md transition-all duration-200 ${
                !isMasonry 
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              title="Grid Layout"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMasonry(true)}
              className={`p-2 rounded-md transition-all duration-200 ${
                isMasonry 
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              title="Masonry Layout"
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>

          <WidgetCustomizer
            availableWidgets={availableWidgets}
            activeWidgets={customWidgets}
            onAddWidget={onAddWidget}
            onRemoveWidget={onRemoveWidget}
          />
        </div>
      </div>
      
      {customWidgets.length > 0 ? (
        <div className={`${getColumnClass()} gap-4 ${isMasonry ? 'space-y-4' : ''}`}>
          {customWidgets.map((widget) => {
            const WidgetComponent = widget.component;
            return (
              <div 
                key={widget.id} 
                className={`
                  ${isMasonry ? 'break-inside-avoid mb-4' : ''}
                  rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200
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