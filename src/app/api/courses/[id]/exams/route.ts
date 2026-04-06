import { NextResponse } from 'next/server';
import { adminDb, isInitialized } from '@/lib/firebase-admin';
import { verifyToken, checkRole } from '@/lib/auth-server';
import { sendExamNotification } from '@/lib/services/email';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id: courseId } = params;
  const token = await verifyToken(req);

  if (!token || !checkRole(token, ['faculty', 'admin'])) {
    return NextResponse.json({ error: 'Unauthorized or Forbidden' }, { status: 403 });
  }

  try {
    const { title, startDate, durationMinutes, totalMarks, questions } = await req.json();

    if (!title || !startDate) {
      return NextResponse.json({ error: 'Missing required exam fields' }, { status: 400 });
    }

    const generateExamCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const prefix = title ? title.substring(0, 3).toUpperCase() : 'EXAM';
      return `${prefix}-${code}`;
    };

    const examCode = generateExamCode();

    // HANDLE MOCK MODE SUCCESS
    if (!isInitialized || token.uid.startsWith('mock-')) {
      console.warn('[API-Exams] Mocking exam creation success (Firebase Admin not initialized)');
      return NextResponse.json({
        id: `mock-exam-${Date.now()}`,
        message: 'Exam created successfully (MOCK MODE)',
        examCode: examCode,
        isMock: true
      }, { status: 201 });
    }

    const examRef = await adminDb.collection('exams').add({
      courseId,
      title,
      examCode,
      startDate,
      durationMinutes: durationMinutes || 60,
      totalMarks: totalMarks || 0,
      questions: questions || [],
      examsCount: 0,
      resultsPublished: false,
      createdAt: new Date().toISOString(),
    });

    // Notify enrolled students
    try {
      const enrollmentsSnapshot = await adminDb.collection('enrollments').where('subjectId', '==', courseId).get();
      const studentIds: string[] = [];
      enrollmentsSnapshot.forEach((doc: any) => studentIds.push(doc.data().studentId));

      for (const studentId of studentIds) {
        const studentDoc = await adminDb.collection('users').doc(studentId).get();
        if (studentDoc.exists) {
          const studentData = studentDoc.data();
          if (studentData?.email) {
            await sendExamNotification(studentData.email, title, startDate);
          }
        }
      }
    } catch (notifError) {
      console.warn('[API-Exams] Notification failed, but exam was created.');
    }

    return NextResponse.json({ id: examRef.id, message: 'Exam created and students notified' }, { status: 201 });
  } catch (error: any) {
    console.error('[API-Exams] Creation Error:', error.message);
    return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 });
  }
}
