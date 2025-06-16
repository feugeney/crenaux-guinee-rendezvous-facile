
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Flag, Edit, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

interface PoliticalProgram {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed';
  participants: number;
  startDate: string;
  endDate: string;
}

export const PoliticalProgramManagement = () => {
  const [programs, setPrograms] = useState<PoliticalProgram[]>([
    {
      id: '1',
      title: 'Formation Leadership Politique',
      description: 'Programme complet de formation au leadership politique pour les nouveaux candidats.',
      status: 'active',
      participants: 25,
      startDate: '2024-01-15',
      endDate: '2024-06-15'
    },
    {
      id: '2',
      title: 'Campagne Électorale 2024',
      description: 'Préparation et accompagnement pour les élections municipales.',
      status: 'active',
      participants: 12,
      startDate: '2024-02-01',
      endDate: '2024-12-31'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<PoliticalProgram | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft' as 'draft' | 'active' | 'completed',
    startDate: '',
    endDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProgram) {
      setPrograms(programs.map(p => 
        p.id === editingProgram.id 
          ? { ...p, ...formData }
          : p
      ));
      toast.success('Programme mis à jour');
    } else {
      const newProgram: PoliticalProgram = {
        id: Date.now().toString(),
        ...formData,
        participants: 0
      };
      setPrograms([...programs, newProgram]);
      toast.success('Programme créé');
    }
    
    setShowForm(false);
    setEditingProgram(null);
    resetForm();
  };

  const handleEdit = (program: PoliticalProgram) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      description: program.description,
      status: program.status,
      startDate: program.startDate,
      endDate: program.endDate
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce programme ?')) {
      setPrograms(programs.filter(p => p.id !== id));
      toast.success('Programme supprimé');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'draft',
      startDate: '',
      endDate: ''
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Actif</span>;
      case 'draft':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Brouillon</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Terminé</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programmes politiques</h1>
          <p className="text-gray-600">Gérez vos programmes de formation et campagnes politiques</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-gold-600 hover:bg-gold-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau programme
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProgram ? 'Modifier le programme' : 'Nouveau programme'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre du programme</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status">Statut</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="active">Actif</option>
                    <option value="completed">Terminé</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="startDate">Date de début</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">Date de fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-gold-600 hover:bg-gold-700">
                  {editingProgram ? 'Modifier' : 'Créer'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingProgram(null);
                    resetForm();
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {programs.map((program) => (
          <Card key={program.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Flag className="h-6 w-6 text-gold-600" />
                  <div>
                    <CardTitle className="text-lg">{program.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(program.status)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(program)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(program.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{program.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{program.participants} participant(s)</span>
                </div>
                <div className="text-sm text-gray-500">
                  Du {new Date(program.startDate).toLocaleDateString('fr-FR')} 
                  au {new Date(program.endDate).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
