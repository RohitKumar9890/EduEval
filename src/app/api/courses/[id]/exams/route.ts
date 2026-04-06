import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyToken, checkRole } from '@/lib/auth-server';
import { sendExamNotification } from '@/lib/services/email';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';
  const params = await context.params;
  const { id: courseId } = params;

  try {
    const body = await req.json();
    const { title, startDate, durationMinutes, totalMarks, questions } = body;

    // 1. EMERGENCY BYPASS FOR DEMO/MOCK MODE
    if (IS_MOCK) {
      console.warn('[API-Exams] Mocking success (MOCK_MODE=true)');
      const generateExamCode = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const prefix = title ? title.substring(0, 3).toUpperCase() : 'EXAM';
        return `${prefix}-${code}`;
      };

      return NextResponse.json({
        id: `mock-exam-${Date.now()}`,
        message: 'Exam created successfully (MOCK MODE BYPASS)',
        examCode: generateExamCode(),
        isMock: true
      }, { status: 201 });
    }

    // 2. LIVE FIREBASE LOGIC
    const token = await verifyToken(req);
    if (!token || !checkRole(token, ['faculty', 'admin'])) {
      return NextResponse.json({ error: 'Unauthorized or Forbidden' }, { status: 403 });
    }

    if (!title || !startDate) {
      return NextResponse.json({ error: 'Missing required fields: title or startDate' }, { status: 400 });
    }

    const examCode = (() => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
      const prefix = title ? title.substring(0, 3).toUpperCase() : 'EXAM';
      return `${prefix}-${code}`;
    })();

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
      console.warn('[API-Exams] Notification failed.');
    }

    return NextResponse.json({ id: examRef.id, message: 'Exam created successfully' }, { status: 201 });

  } catch (error: any) {
    console.error('[API-Exams] Critical Error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
