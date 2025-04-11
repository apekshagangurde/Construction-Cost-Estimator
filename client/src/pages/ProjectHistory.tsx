import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Project } from "@shared/schema";
import { formatCurrency } from "@/utils/calculations";
import { Link } from "wouter";
import { Eye, FileText, Loader2 } from "lucide-react";

const ProjectHistory = () => {
  const { data: projects, isLoading, isError } = useQuery<Project[]>({
    queryKey: ["/api/projects"]
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Project History</h1>
            <Link href="/dashboard">
              <Button>
                New Project
              </Button>
            </Link>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : isError ? (
                <div className="text-center py-12">
                  <p className="text-red-500">Failed to load projects. Please try again.</p>
                </div>
              ) : projects && projects.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Dimensions</TableHead>
                        <TableHead>Total Cost</TableHead>
                        <TableHead>Date Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.name}</TableCell>
                          <TableCell className="capitalize">{project.type}</TableCell>
                          <TableCell>{`${project.length} x ${project.width} x ${project.height} ft`}</TableCell>
                          <TableCell>{formatCurrency(Number(project.totalCost))}</TableCell>
                          <TableCell>{new Date(project.createdAt!).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Link href={`/dashboard?projectId=${project.id}`}>
                              <Button size="sm" variant="outline" className="mr-2">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            <Link href={`/api/projects/${project.id}/report`} target="_blank">
                              <Button size="sm" variant="outline">
                                <FileText className="h-4 w-4 mr-1" />
                                Report
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No projects found. Create a new project to get started.</p>
                  <Link href="/dashboard">
                    <Button className="mt-4">
                      Create Project
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectHistory;
