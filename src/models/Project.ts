import mongoose, { Schema, Document } from 'mongoose';

export interface IArchitectureNode {
  id: string;
  label: string;
  sublabel?: string;
  tech?: string;
}

export interface IArchitectureArrow {
  from: string;
  to: string;
}

export interface IArchitectureDiagram {
  title?: string;
  caption?: string;
  nodes: IArchitectureNode[];
  arrows: IArchitectureArrow[];
}

export interface IProject extends Document {
  id: string; // Unique string identifier
  title: string;
  description: string;
  projectImageUrl: string;
  liveDemoUrl: string;
  githubRepoUrl: string;
  skillIds: string[];
  categorySlug: string;
  status: 'Live' | 'In development';
  overview: string;
  problem: string;
  whatIBuilt: string;
  result: string;
  architectureDiagram?: IArchitectureDiagram;
  order: number;
  isPublished: boolean;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string | Date;
}

const ArchitectureNodeSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    sublabel: { type: String, default: '' },
    tech: { type: String, default: '' },
  },
  { _id: false }
);

const ArchitectureArrowSchema = new Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
  },
  { _id: false }
);

const ArchitectureDiagramSchema = new Schema(
  {
    title: { type: String, default: 'How the system is structured' },
    caption: { type: String, default: '' },
    nodes: { type: [ArchitectureNodeSchema], default: [] },
    arrows: { type: [ArchitectureArrowSchema], default: [] },
  },
  { _id: false }
);

const ProjectSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    projectImageUrl: { type: String, default: 'https://picsum.photos/seed/project/800/600' },
    liveDemoUrl: { type: String, default: '#' },
    githubRepoUrl: { type: String, default: '#' },
    skillIds: { type: [String], default: [] },
    categorySlug: { type: String, default: '' },
    status: { type: String, enum: ['Live', 'In development'], default: 'Live' },
    overview: { type: String, default: '' },
    problem: { type: String, default: '' },
    whatIBuilt: { type: String, default: '' },
    result: { type: String, default: '' },
    architectureDiagram: { type: ArchitectureDiagramSchema, default: null },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    updatedBy: { type: String, default: 'system' },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
    collection: 'projects',
  }
);

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
