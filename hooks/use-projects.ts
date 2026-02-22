import { useState, useEffect } from 'react';
import { Project } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'scholarflow_projects';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProjects(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse projects', e);
      }
    }
    setLoading(false);
  }, []);

  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
  };

  const addProject = (title: string, description: string, type: Project['type']) => {
    const newProject: Project = {
      id: uuidv4(),
      title,
      description,
      type,
      lastModified: Date.now(),
      content: '',
      outline: [],
      status: 'draft',
      progress: 0,
    };
    saveProjects([newProject, ...projects]);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const newProjects = projects.map((p) =>
      p.id === id ? { ...p, ...updates, lastModified: Date.now() } : p
    );
    saveProjects(newProjects);
  };

  const deleteProject = (id: string) => {
    const newProjects = projects.filter((p) => p.id !== id);
    saveProjects(newProjects);
  };

  const getProject = (id: string) => projects.find((p) => p.id === id);

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    getProject,
  };
}
