import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  id: string; // Keep compatibility with existing Firestore uuid/id format
  name: string;
  category: string;
  proficiency: string;
  iconName: string;
}

const SkillSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    proficiency: { type: String, required: true },
    iconName: { type: String, default: 'Code2' },
  },
  {
    timestamps: true,
    collection: 'skills'
  }
);

export default mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);
