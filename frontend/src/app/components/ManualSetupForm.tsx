import { useState } from 'react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CheckCircle2 } from 'lucide-react';
import { SubItemManager } from './SubItemManager';
import { useFinanceData } from '../services/FinanceDataService';
import { ScrollArea } from './ui/scroll-area';

interface ManualSetupFormProps {
  onComplete: () => void;
}

export function ManualSetupForm({ onComplete }: ManualSetupFormProps) {
  const [activeTab, setActiveTab] = useState('income');
  const { profile, addSubItem, updateSubItem, deleteSubItem } = useFinanceData();

  const handleComplete = () => {
    // Save and complete
    onComplete();
  };

  return (
    <div className="space-y-6 py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="liabilities">Debts</TabsTrigger>
        </TabsList>

        {/* Income Tab */}
        <TabsContent value="income">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-4 pr-4">
              {profile.income.map((category) => (
                <SubItemManager
                  key={category.id}
                  categoryName={category.name}
                  subItems={category.subItems}
                  onAdd={(subItem) => addSubItem('income', category.id, subItem)}
                  onUpdate={(subItemId, updates) =>
                    updateSubItem('income', category.id, subItemId, updates)
                  }
                  onDelete={(subItemId) => deleteSubItem('income', category.id, subItemId)}
                />
              ))}
              <Button onClick={() => setActiveTab('expenses')} className="w-full">
                Next: Expenses
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-4 pr-4">
              {profile.expenses.map((category) => (
                <SubItemManager
                  key={category.id}
                  categoryName={category.name}
                  subItems={category.subItems}
                  onAdd={(subItem) => addSubItem('expenses', category.id, subItem)}
                  onUpdate={(subItemId, updates) =>
                    updateSubItem('expenses', category.id, subItemId, updates)
                  }
                  onDelete={(subItemId) => deleteSubItem('expenses', category.id, subItemId)}
                />
              ))}
              <Button onClick={() => setActiveTab('assets')} className="w-full">
                Next: Assets
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-4 pr-4">
              {profile.assets.map((category) => (
                <SubItemManager
                  key={category.id}
                  categoryName={category.name}
                  subItems={category.subItems}
                  onAdd={(subItem) => addSubItem('assets', category.id, subItem)}
                  onUpdate={(subItemId, updates) =>
                    updateSubItem('assets', category.id, subItemId, updates)
                  }
                  onDelete={(subItemId) => deleteSubItem('assets', category.id, subItemId)}
                />
              ))}
              <Button onClick={() => setActiveTab('liabilities')} className="w-full">
                Next: Liabilities
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Liabilities Tab */}
        <TabsContent value="liabilities">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-4 pr-4">
              {profile.liabilities.map((category) => (
                <SubItemManager
                  key={category.id}
                  categoryName={category.name}
                  subItems={category.subItems}
                  onAdd={(subItem) => addSubItem('liabilities', category.id, subItem)}
                  onUpdate={(subItemId, updates) =>
                    updateSubItem('liabilities', category.id, subItemId, updates)
                  }
                  onDelete={(subItemId) => deleteSubItem('liabilities', category.id, subItemId)}
                />
              ))}
              <Button onClick={handleComplete} className="w-full gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Complete Setup
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}