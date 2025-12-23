import { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { SubItem } from '../models/finance.models';
import { cn } from './ui/utils';

interface SubItemManagerProps {
  categoryName: string;
  subItems: SubItem[];
  onAdd: (subItem: Omit<SubItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (subItemId: string, updates: Partial<SubItem>) => void;
  onDelete: (subItemId: string) => void;
  className?: string;
}

interface SubItemFormData {
  name: string;
  amount: string;
  type?: string;
  notes?: string;
  frequency?: 'monthly' | 'yearly' | 'one-time';
}

export function SubItemManager({
  categoryName,
  subItems,
  onAdd,
  onUpdate,
  onDelete,
  className,
}: SubItemManagerProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SubItemFormData>({
    name: '',
    amount: '',
    type: '',
    notes: '',
    frequency: 'monthly',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      amount: '',
      type: '',
      notes: '',
      frequency: 'monthly',
    });
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    const amount = parseFloat(formData.amount);
    if (!formData.name || isNaN(amount)) return;

    if (editingId) {
      onUpdate(editingId, {
        name: formData.name,
        amount,
        type: formData.type,
        notes: formData.notes,
        frequency: formData.frequency,
      });
    } else {
      onAdd({
        name: formData.name,
        amount,
        type: formData.type,
        notes: formData.notes,
        frequency: formData.frequency,
      });
    }

    resetForm();
  };

  const handleEdit = (item: SubItem) => {
    setFormData({
      name: item.name,
      amount: item.amount.toString(),
      type: item.type || '',
      notes: item.notes || '',
      frequency: item.frequency || 'monthly',
    });
    setEditingId(item.id);
    setIsAddingNew(true);
  };

  const getTotalAmount = () => {
    return subItems.reduce((sum, item) => sum + item.amount, 0);
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{categoryName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {subItems.length} {subItems.length === 1 ? 'item' : 'items'} • Total: ₹
              {getTotalAmount().toLocaleString('en-IN')}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingNew(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Add/Edit Form */}
        {isAddingNew && (
          <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-3 mb-3">
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                placeholder="e.g., Gold, Fixed Deposit, etc."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="item-amount">Amount (₹)</Label>
                <Input
                  id="item-amount"
                  type="number"
                  placeholder="100000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-frequency">Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, frequency: value })
                  }
                >
                  <SelectTrigger id="item-frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-type">Type (Optional)</Label>
              <Input
                id="item-type"
                placeholder="e.g., Investment, Expense, etc."
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-notes">Notes (Optional)</Label>
              <Input
                id="item-notes"
                placeholder="Add any additional details..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSubmit} size="sm" className="flex-1">
                <Check className="w-4 h-4 mr-2" />
                {editingId ? 'Update' : 'Add'}
              </Button>
              <Button onClick={resetForm} variant="outline" size="sm" className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Sub-items List */}
        {subItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No items added yet</p>
            <p className="text-xs mt-1">Click "Add Item" to get started</p>
          </div>
        ) : (
          <div className="space-y-1">
            {subItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{item.name}</p>
                    {item.type && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                        {item.type}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span>₹{item.amount.toLocaleString('en-IN')}</span>
                    {item.frequency && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{item.frequency}</span>
                      </>
                    )}
                  </div>
                  {item.notes && (
                    <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                  )}
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(item)}
                    className="h-8 w-8"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete {item.name}?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete this item
                          from your financial records.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            onDelete(item.id);
                          }}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
