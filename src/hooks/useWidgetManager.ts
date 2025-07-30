import { useState, useEffect } from 'react';
import { Widget } from '../types/widgetTypes';
import { availableWidgets } from '../config/widgetConfig';

export const useWidgetManager = () => {
  const [customWidgets, setCustomWidgets] = useState<Widget[]>([]);

  useEffect(() => {
    const savedWidgets = localStorage.getItem('custom-widgets');
    if (savedWidgets) {
      const parsedWidgets = JSON.parse(savedWidgets);
      const mappedWidgets = parsedWidgets.map((saved: any) => {
        const availableWidget = availableWidgets.find(w => w.type === saved.type);
        return availableWidget ? { ...saved, component: availableWidget.component } : null;
      }).filter(Boolean);
      setCustomWidgets(mappedWidgets);
    }
  }, []);

  const saveCustomWidgets = (widgets: Widget[]) => {
    const widgetsToSave = widgets.map(({ component, ...rest }) => rest);
    localStorage.setItem('custom-widgets', JSON.stringify(widgetsToSave));
    setCustomWidgets(widgets);
  };

  const addCustomWidget = (widget: Widget) => {
    const newWidget = { ...widget, id: `${widget.type}-${Date.now()}` };
    const updatedWidgets = [...customWidgets, newWidget];
    saveCustomWidgets(updatedWidgets);
  };

  const removeCustomWidget = (id: string) => {
    const updatedWidgets = customWidgets.filter(w => w.id !== id);
    saveCustomWidgets(updatedWidgets);
  };

  return {
    customWidgets,
    addCustomWidget,
    removeCustomWidget
  };
};