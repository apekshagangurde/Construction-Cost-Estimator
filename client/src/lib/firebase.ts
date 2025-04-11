import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { type ProjectWithCalculations } from "@shared/schema";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Collection references
const projectsCollection = "projects";

// Modified ProjectWithCalculations for Firestore compatibility
export type FirestoreProject = Omit<ProjectWithCalculations, 'id'> & { id: string };

// Firebase Project Service
export const projectService = {
  // Get all projects
  getAllProjects: async (): Promise<FirestoreProject[]> => {
    try {
      const projectsRef = collection(db, projectsCollection);
      const snapshot = await getDocs(projectsRef);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as FirestoreProject[];
    } catch (error) {
      console.error("Error getting projects:", error);
      throw error;
    }
  },

  // Get a single project by ID
  getProjectById: async (projectId: string): Promise<FirestoreProject | null> => {
    try {
      const projectRef = doc(db, projectsCollection, projectId);
      const projectDoc = await getDoc(projectRef);
      
      if (projectDoc.exists()) {
        return { 
          id: projectDoc.id, 
          ...projectDoc.data() 
        } as FirestoreProject;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting project:", error);
      throw error;
    }
  },

  // Create a new project
  createProject: async (projectData: Omit<ProjectWithCalculations, "id">): Promise<string> => {
    try {
      const projectsRef = collection(db, projectsCollection);
      const docRef = await addDoc(projectsRef, projectData);
      return docRef.id;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },

  // Update an existing project
  updateProject: async (projectId: string, projectData: Partial<ProjectWithCalculations>): Promise<void> => {
    try {
      const projectRef = doc(db, projectsCollection, projectId);
      await updateDoc(projectRef, projectData);
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  },

  // Delete a project
  deleteProject: async (projectId: string): Promise<void> => {
    try {
      const projectRef = doc(db, projectsCollection, projectId);
      await deleteDoc(projectRef);
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  },
  
  // Get projects by type
  getProjectsByType: async (type: string): Promise<FirestoreProject[]> => {
    try {
      const projectsRef = collection(db, projectsCollection);
      const q = query(projectsRef, where("type", "==", type));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as FirestoreProject[];
    } catch (error) {
      console.error("Error getting projects by type:", error);
      throw error;
    }
  },
};

export { db };