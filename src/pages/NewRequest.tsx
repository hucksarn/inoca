import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Upload, Save, Send, Loader2 } from 'lucide-react';
import { useProjects, useCreateMaterialRequest } from '@/hooks/useDatabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type MaterialCategory = 'cement' | 'steel' | 'block' | 'electrical' | 'plumbing' | 'finishing' | 'other';
type Unit = 'nos' | 'bags' | 'kg' | 'ton' | 'm3';

const categories: { value: MaterialCategory; label: string }[] = [
  { value: 'cement', label: 'Cement' },
  { value: 'steel', label: 'Steel' },
  { value: 'block', label: 'Block' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'finishing', label: 'Finishing' },
  { value: 'other', label: 'Other' },
];

const units: { value: Unit; label: string }[] = [
  { value: 'nos', label: 'Nos' },
  { value: 'bags', label: 'Bags' },
  { value: 'kg', label: 'Kg' },
  { value: 'ton', label: 'Ton' },
  { value: 'm3', label: 'm³' },
];

interface FormItem {
  id: string;
  category: MaterialCategory | '';
  name: string;
  specification: string;
  quantity: string;
  unit: Unit | '';
  preferredBrand: string;
}

export default function NewRequest() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const createRequest = useCreateMaterialRequest();
  
  const [formData, setFormData] = useState({
    projectId: '',
    requestType: '' as 'stock_request' | 'purchase_request' | '',
    priority: 'normal' as 'urgent' | 'normal',
    requiredDate: '',
    remarks: '',
  });

  const [items, setItems] = useState<FormItem[]>([
    { id: '1', category: '', name: '', specification: '', quantity: '', unit: '', preferredBrand: '' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), category: '', name: '', specification: '', quantity: '', unit: '', preferredBrand: '' }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof FormItem, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const validateForm = () => {
    if (!formData.projectId) {
      toast({ title: 'Error', description: 'Please select a project', variant: 'destructive' });
      return false;
    }
    if (!formData.requestType) {
      toast({ title: 'Error', description: 'Please select a request type', variant: 'destructive' });
      return false;
    }
    if (formData.requestType === 'purchase_request' && !formData.requiredDate) {
      toast({ title: 'Error', description: 'Required date is mandatory for purchase requests', variant: 'destructive' });
      return false;
    }

    const validItems = items.filter(item => item.category && item.name && item.quantity && item.unit);
    if (validItems.length === 0) {
      toast({ title: 'Error', description: 'Please add at least one complete material item', variant: 'destructive' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (asDraft: boolean) => {
    if (!asDraft && !validateForm()) return;

    setIsSubmitting(true);

    const validItems = items
      .filter(item => item.category && item.name && item.quantity && item.unit)
      .map(item => ({
        category: item.category as string,
        name: item.name,
        specification: item.specification || null,
        quantity: parseFloat(item.quantity),
        unit: item.unit as string,
        preferred_brand: item.preferredBrand || null,
      }));

    try {
      await createRequest.mutateAsync({
        projectId: formData.projectId,
        requestType: formData.requestType as string,
        priority: formData.priority,
        requiredDate: formData.requiredDate || null,
        remarks: formData.remarks,
        items: validItems,
        status: asDraft ? 'draft' : 'submitted',
      });

      toast({
        title: asDraft ? "Draft saved" : "Request submitted",
        description: asDraft 
          ? "Your request has been saved as a draft." 
          : "Your request has been submitted for approval.",
      });
      navigate('/requests');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create request',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (projectsLoading) {
    return (
      <MainLayout title="New Material Request" subtitle="Create a new material request for your project">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="New Material Request" 
      subtitle="Create a new material request for your project"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Section A: Request Details */}
        <div className="form-section animate-slide-up">
          <h2 className="form-section-title">Section A – Request Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project">Project / Site *</Label>
              <Select 
                value={formData.projectId} 
                onValueChange={(v) => setFormData({ ...formData, projectId: v })}
              >
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.filter(p => p.status === 'active').map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Request Type *</Label>
              <Select 
                value={formData.requestType} 
                onValueChange={(v) => setFormData({ ...formData, requestType: v as any })}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock_request">Stock Request</SelectItem>
                  <SelectItem value="purchase_request">Purchase Request</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(v) => setFormData({ ...formData, priority: v as any })}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.requestType === 'purchase_request' && (
              <div className="space-y-2">
                <Label htmlFor="requiredDate">Required Date *</Label>
                <Input
                  id="requiredDate"
                  type="date"
                  value={formData.requiredDate}
                  onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
                />
              </div>
            )}

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="remarks">Remarks / Reason</Label>
              <Textarea
                id="remarks"
                placeholder="Provide details about this request..."
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Section B: Requester Details */}
        <div className="form-section animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h2 className="form-section-title">Section B – Requester Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={profile?.full_name || ''} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Designation</Label>
              <Input value={profile?.designation || ''} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input value={profile?.phone || 'Not set'} disabled className="bg-muted" />
            </div>
          </div>
        </div>

        {/* Section C: Material Details */}
        <div className="form-section animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="form-section-title">Section C – Material Details</h2>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="p-4 rounded-lg bg-muted/50 border border-border space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-muted-foreground">
                    Item #{index + 1}
                  </span>
                  {items.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select 
                      value={item.category} 
                      onValueChange={(v) => updateItem(item.id, 'category', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Material Name *</Label>
                    <Input
                      placeholder="e.g., Portland Cement"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Specification</Label>
                    <Input
                      placeholder="Grade, size, standard..."
                      value={item.specification}
                      onChange={(e) => updateItem(item.id, 'specification', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="0"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Unit *</Label>
                    <Select 
                      value={item.unit} 
                      onValueChange={(v) => updateItem(item.id, 'unit', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map(unit => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Brand</Label>
                    <Input
                      placeholder="Optional"
                      value={item.preferredBrand}
                      onChange={(e) => updateItem(item.id, 'preferredBrand', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button 
              type="button" 
              variant="outline" 
              onClick={addItem}
              className="w-full border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Item
            </Button>
          </div>
        </div>

        {/* Section D: Attachments */}
        <div className="form-section animate-slide-up" style={{ animationDelay: '300ms' }}>
          <h2 className="form-section-title">Section D – Attachments</h2>
          
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Site photos, drawings, BOQ extracts (Max 10MB each)
            </p>
            <Button variant="outline" className="mt-4">
              Choose Files
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
          <Button variant="outline" onClick={() => navigate('/requests')} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={() => handleSubmit(true)} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save as Draft
          </Button>
          <Button variant="accent" onClick={() => handleSubmit(false)} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            Submit Request
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
