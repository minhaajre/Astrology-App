import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, LogOut, Shield, Users, ArrowLeft, ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { Link } from "wouter";
import type { Evaluation } from "@shared/schema";
import { NumberAccordion } from "@/components/NumberAccordion";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { animalFriends, animalEnemiesPrimary, vietnamAnimals, getVietnamAnimal } from "@/lib/numerology";

function getCautionYears(animal: string, startYear: number = new Date().getFullYear()): number[] {
  const enemies = animalEnemiesPrimary[animal] || [];
  if (enemies.length === 0) return [];
  
  const cautionYears: number[] = [];
  let year = startYear;
  
  // Find the next 3 years where the calendar year's animal is an enemy
  // Each enemy animal appears every 12 years, so search up to 36 years to find 3
  while (cautionYears.length < 3 && year <= startYear + 36) {
    const yearAnimal = getVietnamAnimal(year, new Date(year, 6, 1));
    if (enemies.includes(yearAnimal)) {
      cautionYears.push(year);
    }
    year++;
  }
  return cautionYears;
}

function getFriendlySignsFromAnimal(animal: string): string[] {
  return animalFriends[animal] || [];
}

export default function Admin() {
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState({ name: "", birthDate: "" });

  const toggleRow = (id: number) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = (evaluations: Evaluation[]) => {
    if (selectedIds.size === evaluations.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(evaluations.map(e => e.id)));
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/evaluations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/evaluations"] });
      toast({ title: "Deleted", description: "Evaluation removed successfully" });
      setDeleteDialogOpen(false);
      setSelectedEvaluation(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete evaluation", variant: "destructive" });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      await apiRequest("POST", "/api/evaluations/bulk-delete", { ids });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/evaluations"] });
      toast({ title: "Deleted", description: `${variables.length} evaluations removed successfully` });
      setBulkDeleteDialogOpen(false);
      setSelectedIds(new Set());
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete evaluations", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Evaluation> }) => {
      await apiRequest("PUT", `/api/evaluations/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/evaluations"] });
      toast({ title: "Updated", description: "Evaluation updated successfully" });
      setEditDialogOpen(false);
      setSelectedEvaluation(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update evaluation", variant: "destructive" });
    },
  });

  const handleEdit = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setFormData({ name: evaluation.name, birthDate: evaluation.birthDate });
    setEditDialogOpen(true);
  };

  const handleDelete = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setDeleteDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedEvaluation) {
      updateMutation.mutate({ id: selectedEvaluation.id, data: formData });
    }
  };

  const { data: adminCheck, isLoading: adminCheckLoading } = useQuery<{
    isAdmin: boolean;
    email: string;
  }>({
    queryKey: ["/api/admin/check"],
    enabled: isAuthenticated,
  });

  const {
    data: evaluations,
    isLoading: evaluationsLoading,
    error,
  } = useQuery<Evaluation[]>({
    queryKey: ["/api/evaluations"],
    enabled: adminCheck?.isAdmin === true,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading || adminCheckLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground mb-4">
              Please log in to access the admin panel.
            </p>
            <Button onClick={() => (window.location.href = "/api/login")} data-testid="button-login">
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!adminCheck?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-2">
              You don't have admin privileges.
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Logged in as: {adminCheck?.email}
            </p>
            <div className="flex gap-2 justify-center">
              <Link href="/">
                <Button variant="outline" data-testid="button-back-home">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button variant="ghost" onClick={() => logout()} data-testid="button-logout">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Link href="/">
              <Button variant="outline" size="sm" data-testid="button-back-home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => logout()} data-testid="button-logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Evaluated Users
              {evaluations && (
                <Badge variant="secondary" className="ml-2">
                  {evaluations.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {evaluationsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <p className="text-destructive text-center py-8">
                Failed to load evaluations
              </p>
            ) : evaluations && evaluations.length > 0 ? (
              <div className="space-y-4">
                {selectedIds.size > 0 && (
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-md">
                    <span className="text-sm font-medium">
                      {selectedIds.size} selected
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setBulkDeleteDialogOpen(true)}
                      data-testid="button-bulk-delete"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedIds(new Set())}
                      data-testid="button-clear-selection"
                    >
                      Clear Selection
                    </Button>
                  </div>
                )}
                <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedIds.size === evaluations.length && evaluations.length > 0}
                          onCheckedChange={() => toggleSelectAll(evaluations)}
                          data-testid="checkbox-select-all"
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Birth Date</TableHead>
                      <TableHead>Life Path</TableHead>
                      <TableHead>Zodiac</TableHead>
                      <TableHead>Personal Year</TableHead>
                      <TableHead>Friendly Signs</TableHead>
                      <TableHead>Caution Years</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluations.map((evaluation) => {
                      const isExpanded = !!expandedRows[evaluation.id];
                      let fullData = null;
                      try {
                        if (evaluation.reportData) {
                          fullData = JSON.parse(evaluation.reportData);
                        }
                      } catch (e) {
                        console.error("Error parsing report data", e);
                      }

                      return (
                        <>
                          <TableRow 
                            key={evaluation.id} 
                            data-testid={`row-evaluation-${evaluation.id}`}
                            className={`cursor-pointer hover:bg-muted/50 transition-colors select-none ${selectedIds.has(evaluation.id) ? 'bg-muted/30' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleRow(evaluation.id);
                            }}
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedIds.has(evaluation.id)}
                                onCheckedChange={() => toggleSelection(evaluation.id)}
                                onClick={(e) => e.stopPropagation()}
                                data-testid={`checkbox-row-${evaluation.id}`}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                {evaluation.name}
                              </div>
                            </TableCell>
                            <TableCell>{evaluation.birthDate}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {evaluation.lifePath}
                                {evaluation.lifePathLabel && (
                                  <span className="ml-1 text-xs">
                                    ({evaluation.lifePathLabel})
                                  </span>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>{evaluation.zodiacAnimal || "-"}</TableCell>
                            <TableCell>
                              {fullData?.personalYear ? (
                                <Badge variant="outline">{fullData.personalYear}</Badge>
                              ) : "-"}
                            </TableCell>
                            <TableCell>
                              {evaluation.zodiacAnimal ? (
                                <span className="text-sm text-muted-foreground">
                                  {getFriendlySignsFromAnimal(evaluation.zodiacAnimal).slice(0, 3).join(", ") || "-"}
                                </span>
                              ) : "-"}
                            </TableCell>
                            <TableCell>
                              {evaluation.zodiacAnimal ? (
                                <span className="text-sm text-muted-foreground">
                                  {getCautionYears(evaluation.zodiacAnimal).join(", ") || "-"}
                                </span>
                              ) : "-"}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(evaluation);
                                  }}
                                  data-testid={`button-edit-${evaluation.id}`}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(evaluation);
                                  }}
                                  data-testid={`button-delete-${evaluation.id}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {isExpanded && fullData && (
                            <TableRow className="bg-muted/30">
                              <TableCell colSpan={9} className="p-0">
                                <div className="p-6 border-b border-t animate-in fade-in slide-in-from-top-2 duration-300">
                                  <NumberAccordion
                                    highlightNumbers={[fullData.lp?.lifePath]}
                                    personData={{
                                      name: evaluation.name,
                                      birthDate: new Date(evaluation.birthDate),
                                      lifePath: fullData.lp,
                                      zodiacAnimal: fullData.animal,
                                      zodiacSign: fullData.zodiac,
                                      personalYear: fullData.personalYear,
                                      personalMonth: fullData.personalMonth,
                                      personalDay: fullData.personalDay,
                                      lunarPhase: fullData.lunarInfo?.phase,
                                      universalYear: fullData.universalYear,
                                      expressionNumber: fullData.nameNum?.expressionNumber,
                                      soulUrge: fullData.nameNum?.soulUrge,
                                      personality: fullData.nameNum?.personality
                                    }}
                                    timingAdvisor={fullData.timingAdvisor}
                                    template={fullData.template}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No evaluations yet</p>
                <p className="text-sm">
                  Evaluations will appear here when users calculate their numerology
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Evaluation</DialogTitle>
            <DialogDescription>
              Update the name or birth date for this evaluation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                data-testid="input-edit-name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-birthdate">Birth Date</Label>
              <Input
                id="edit-birthdate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                data-testid="input-edit-birthdate"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} data-testid="button-cancel-edit">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={updateMutation.isPending} data-testid="button-save-edit">
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Evaluation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the evaluation for "{selectedEvaluation?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedEvaluation && deleteMutation.mutate(selectedEvaluation.id)}
              className="bg-destructive text-destructive-foreground"
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Evaluations</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.size} evaluation{selectedIds.size > 1 ? 's' : ''}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-bulk-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => bulkDeleteMutation.mutate(Array.from(selectedIds))}
              className="bg-destructive text-destructive-foreground"
              data-testid="button-confirm-bulk-delete"
            >
              {bulkDeleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete {selectedIds.size} Evaluation{selectedIds.size > 1 ? 's' : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
