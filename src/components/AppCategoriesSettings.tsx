
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AppCategory, AppRule, useAdvancedSettings } from '@/hooks/useAdvancedSettings';

const AppCategoriesSettings: React.FC = () => {
  const {
    categories,
    appRules,
    addCategory,
    updateCategory,
    deleteCategory,
    addAppRule,
    updateAppRule,
    deleteAppRule,
  } = useAdvancedSettings();

  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showAppRuleDialog, setShowAppRuleDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AppCategory | null>(null);
  const [editingRule, setEditingRule] = useState<AppRule | null>(null);

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    color: '#10b981',
    type: 'productive' as 'productive' | 'neutral' | 'distracting',
    keywords: '',
  });

  const [ruleForm, setRuleForm] = useState({
    appName: '',
    categoryId: '',
  });

  const resetCategoryForm = () => {
    setCategoryForm({ name: '', color: '#10b981', type: 'productive', keywords: '' });
    setEditingCategory(null);
  };

  const resetRuleForm = () => {
    setRuleForm({ appName: '', categoryId: '' });
    setEditingRule(null);
  };

  const handleSaveCategory = () => {
    const categoryData = {
      name: categoryForm.name,
      color: categoryForm.color,
      type: categoryForm.type,
      keywords: categoryForm.keywords.split(',').map(k => k.trim()).filter(k => k),
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }

    setShowCategoryDialog(false);
    resetCategoryForm();
  };

  const handleSaveRule = () => {
    if (editingRule) {
      updateAppRule(editingRule.id, ruleForm);
    } else {
      addAppRule(ruleForm.appName, ruleForm.categoryId);
    }

    setShowAppRuleDialog(false);
    resetRuleForm();
  };

  const handleEditCategory = (category: AppCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      color: category.color,
      type: category.type,
      keywords: category.keywords.join(', '),
    });
    setShowCategoryDialog(true);
  };

  const handleEditRule = (rule: AppRule) => {
    setEditingRule(rule);
    setRuleForm({
      appName: rule.appName,
      categoryId: rule.categoryId,
    });
    setShowAppRuleDialog(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'productive': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'neutral': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'distracting': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">App Categories</h3>
          <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={resetCategoryForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="e.g., Development"
                  />
                </div>
                <div>
                  <Label htmlFor="category-type">Type</Label>
                  <Select value={categoryForm.type} onValueChange={(value: 'productive' | 'neutral' | 'distracting') => setCategoryForm({ ...categoryForm, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="productive">Productive</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="distracting">Distracting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category-color">Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="category-color"
                      type="color"
                      value={categoryForm.color}
                      onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={categoryForm.color}
                      onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                      placeholder="#10b981"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="category-keywords">Keywords (comma-separated)</Label>
                  <Input
                    id="category-keywords"
                    value={categoryForm.keywords}
                    onChange={(e) => setCategoryForm({ ...categoryForm, keywords: e.target.value })}
                    placeholder="e.g., code, vscode, terminal"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCategory}>
                    {editingCategory ? 'Update' : 'Add'} Category
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{category.name}</span>
                    <Badge className={getTypeColor(category.type)}>
                      {category.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {category.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditCategory(category)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteCategory(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* App Rules Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">App Rules</h3>
          <Dialog open={showAppRuleDialog} onOpenChange={setShowAppRuleDialog}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={resetRuleForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add App Rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingRule ? 'Edit App Rule' : 'Add New App Rule'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="app-name">Application Name</Label>
                  <Input
                    id="app-name"
                    value={ruleForm.appName}
                    onChange={(e) => setRuleForm({ ...ruleForm, appName: e.target.value })}
                    placeholder="e.g., Visual Studio Code"
                  />
                </div>
                <div>
                  <Label htmlFor="app-category">Category</Label>
                  <Select value={ruleForm.categoryId} onValueChange={(value) => setRuleForm({ ...ruleForm, categoryId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAppRuleDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveRule}>
                    {editingRule ? 'Update' : 'Add'} Rule
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-2">
          {appRules.map((rule) => {
            const category = categories.find(cat => cat.id === rule.categoryId);
            return (
              <div key={rule.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{rule.appName}</span>
                  {category && (
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-muted-foreground">{category.name}</span>
                    </div>
                  )}
                  {rule.isCustom && (
                    <Badge variant="outline" className="text-xs">Custom</Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditRule(rule)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  {rule.isCustom && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteAppRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AppCategoriesSettings;
