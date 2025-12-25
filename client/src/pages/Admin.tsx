import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Loader2, LogOut, Shield, Users, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";
import type { Evaluation } from "@shared/schema";
import { NumberAccordion } from "@/components/NumberAccordion";

export default function Admin() {
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const toggleRow = (id: number) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Birth Date</TableHead>
                      <TableHead>Life Path</TableHead>
                      <TableHead>Zodiac</TableHead>
                      <TableHead>Zodiac Sign</TableHead>
                      <TableHead>Expression</TableHead>
                      <TableHead>Compatibility</TableHead>
                      <TableHead>Date</TableHead>
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
                            className="cursor-pointer hover:bg-muted/50 transition-colors select-none"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleRow(evaluation.id);
                            }}
                          >
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
                            <TableCell>{evaluation.zodiacSign || "-"}</TableCell>
                            <TableCell>{evaluation.expressionNumber || "-"}</TableCell>
                            <TableCell>
                              {evaluation.compatibilityPartner ? (
                                <span>
                                  {evaluation.compatibilityPartner}
                                  {evaluation.compatibilityScore && (
                                    <Badge variant="secondary" className="ml-2">
                                      {evaluation.compatibilityScore}%
                                    </Badge>
                                  )}
                                </span>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {evaluation.createdAt
                                ? new Date(evaluation.createdAt).toLocaleDateString()
                                : "-"}
                            </TableCell>
                          </TableRow>
                          {isExpanded && fullData && (
                            <TableRow className="bg-muted/30">
                              <TableCell colSpan={8} className="p-0">
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
    </div>
  );
}
