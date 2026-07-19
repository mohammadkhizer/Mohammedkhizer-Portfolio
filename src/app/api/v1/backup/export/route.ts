import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { isAdmin } from '@/lib/security';
import Project from '@/models/Project';
import Skill from '@/models/Skill';
import Experience from '@/models/Experience';
import Education from '@/models/Education';
import Certification from '@/models/Certification';
import Achievement from '@/models/Achievement';
import Testimonial from '@/models/Testimonial';
import UserProfile from '@/models/UserProfile';
import ProjectCategory from '@/models/ProjectCategory';
import ContactSubmission from '@/models/ContactSubmission';

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    const [
      projects,
      skills,
      experiences,
      education,
      certifications,
      achievements,
      testimonials,
      userProfiles,
      projectCategories,
      contactSubmissions,
    ] = await Promise.all([
      Project.find().lean(),
      Skill.find().lean(),
      Experience.find().lean(),
      Education.find().lean(),
      Certification.find().lean(),
      Achievement.find().lean(),
      Testimonial.find().lean(),
      UserProfile.find().lean(),
      ProjectCategory.find().lean(),
      ContactSubmission.find().lean(),
    ]);

    const backup = {
      _meta: {
        backupDate: new Date().toISOString(),
        version: '1.0',
        collections: [
          'projects',
          'skills',
          'experiences',
          'education',
          'certifications',
          'achievements',
          'testimonials',
          'userProfiles',
          'projectCategories',
          'contactSubmissions',
        ],
      },
      projects,
      skills,
      experiences,
      education,
      certifications,
      achievements,
      testimonials,
      userProfiles,
      projectCategories,
      contactSubmissions,
    };

    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `portfolio-backup-${dateStr}.json`;

    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Backup export failed:', error);
    return NextResponse.json({ error: 'Backup export failed' }, { status: 500 });
  }
}
