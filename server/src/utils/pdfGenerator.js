import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

/**
 * Generate PDF report for student progress
 */
export const generateProgressReportPDF = async (studentData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).text('Student Progress Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(2);

      // Student Info
      doc.fontSize(14).text('Student Information', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);
      doc.text(`Name: ${studentData.name}`);
      doc.text(`Email: ${studentData.email}`);
      doc.text(`Student ID: ${studentData.id}`);
      doc.moveDown(1.5);

      // Statistics
      doc.fontSize(14).text('Performance Statistics', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);
      doc.text(`Total Exams: ${studentData.stats.totalExams}`);
      doc.text(`Completed: ${studentData.stats.completedExams}`);
      doc.text(`Average Score: ${studentData.stats.averageScore.toFixed(2)}%`);
      doc.text(`Highest Score: ${studentData.stats.highestScore.toFixed(2)}%`);
      doc.moveDown(1.5);

      // Achievements
      if (studentData.achievements && Object.values(studentData.achievements).some(a => a)) {
        doc.fontSize(14).text('Achievements', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10);
        const badges = [];
        if (studentData.achievements.firstExam) badges.push('First Step');
        if (studentData.achievements.perfectScore) badges.push('Perfectionist');
        if (studentData.achievements.fiveExams) badges.push('Dedicated');
        if (studentData.achievements.tenExams) badges.push('Committed');
        if (studentData.achievements.highAverage) badges.push('Excellence');
        
        badges.forEach(badge => doc.text(`• ${badge}`));
        doc.moveDown(1.5);
      }

      // Exam Results Table
      doc.addPage();
      doc.fontSize(14).text('Exam Results', { underline: true });
      doc.moveDown(1);

      // Table header
      const tableTop = doc.y;
      const col1 = 50;
      const col2 = 200;
      const col3 = 350;
      const col4 = 450;

      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Exam', col1, tableTop);
      doc.text('Date', col2, tableTop);
      doc.text('Score', col3, tableTop);
      doc.text('Percentage', col4, tableTop);
      
      doc.moveTo(col1, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      // Table rows
      doc.font('Helvetica');
      let yPos = tableTop + 25;
      
      (studentData.submissions || []).forEach((sub, index) => {
        if (yPos > 700) {
          doc.addPage();
          yPos = 50;
        }

        const examTitle = sub.examTitle || `Exam ${index + 1}`;
        const date = sub.submittedAt ? new Date(sub.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A';
        const score = `${sub.score || 0}/${sub.maxScore || 0}`;
        const percentage = sub.maxScore > 0 ? ((sub.score / sub.maxScore) * 100).toFixed(1) + '%' : 'N/A';

        doc.text(examTitle.substring(0, 25), col1, yPos);
        doc.text(date, col2, yPos);
        doc.text(score, col3, yPos);
        doc.text(percentage, col4, yPos);

        yPos += 20;
      });

      // Footer
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).text(
          `Page ${i + 1} of ${pageCount}`,
          50,
          doc.page.height - 50,
          { align: 'center' }
        );
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate Excel report
 */
export const generateExcelReport = async (data, type = 'student') => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'EduEval';
  workbook.created = new Date();

  if (type === 'student') {
    // Student Progress Sheet
    const sheet = workbook.addWorksheet('Progress Report');

    // Header
    sheet.mergeCells('A1:D1');
    sheet.getCell('A1').value = 'Student Progress Report';
    sheet.getCell('A1').font = { size: 16, bold: true };
    sheet.getCell('A1').alignment = { horizontal: 'center' };

    // Student Info
    sheet.addRow([]);
    sheet.addRow(['Name:', data.name]);
    sheet.addRow(['Email:', data.email]);
    sheet.addRow(['Generated:', new Date().toLocaleDateString()]);
    sheet.addRow([]);

    // Statistics
    sheet.addRow(['Performance Statistics']);
    sheet.getCell('A7').font = { bold: true };
    sheet.addRow(['Total Exams:', data.stats.totalExams]);
    sheet.addRow(['Completed:', data.stats.completedExams]);
    sheet.addRow(['Average Score:', data.stats.averageScore.toFixed(2) + '%']);
    sheet.addRow(['Highest Score:', data.stats.highestScore.toFixed(2) + '%']);
    sheet.addRow([]);

    // Exam Results
    sheet.addRow(['Exam Results']);
    sheet.getCell('A13').font = { bold: true };
    
    const headerRow = sheet.addRow(['Exam', 'Date', 'Score', 'Max Score', 'Percentage', 'Status']);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };

    (data.submissions || []).forEach(sub => {
      const percentage = sub.maxScore > 0 ? ((sub.score / sub.maxScore) * 100).toFixed(1) : 0;
      sheet.addRow([
        sub.examTitle || 'N/A',
        sub.submittedAt ? new Date(sub.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A',
        sub.score || 0,
        sub.maxScore || 0,
        percentage + '%',
        sub.status || 'pending'
      ]);
    });

    // Auto-fit columns
    sheet.columns.forEach(column => {
      column.width = 20;
    });

  } else if (type === 'class') {
    // Class Report Sheet
    const sheet = workbook.addWorksheet('Class Report');

    sheet.mergeCells('A1:E1');
    sheet.getCell('A1').value = 'Class Performance Report';
    sheet.getCell('A1').font = { size: 16, bold: true };
    sheet.getCell('A1').alignment = { horizontal: 'center' };

    sheet.addRow([]);
    sheet.addRow(['Generated:', new Date().toLocaleDateString()]);
    sheet.addRow([]);

    const headerRow = sheet.addRow(['Student', 'Email', 'Exams Completed', 'Average Score', 'Status']);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };

    (data.students || []).forEach(student => {
      sheet.addRow([
        student.name,
        student.email,
        student.examsCompleted || 0,
        (student.averageScore || 0).toFixed(2) + '%',
        student.isActive ? 'Active' : 'Inactive'
      ]);
    });

    sheet.columns.forEach(column => {
      column.width = 25;
    });
  }

  return await workbook.xlsx.writeBuffer();
};

/**
 * Generate transcript
 */
export const generateTranscript = async (studentData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Transcript Header
      doc.fontSize(24).text('OFFICIAL TRANSCRIPT', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(12).text('Educational Evaluation Platform', { align: 'center' });
      doc.moveDown(2);

      // Student Information
      doc.fontSize(14).text('Student Information', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11);
      doc.text(`Name: ${studentData.name}`);
      doc.text(`Student ID: ${studentData.id}`);
      doc.text(`Email: ${studentData.email}`);
      doc.moveDown(1.5);

      // Academic Summary
      doc.fontSize(14).text('Academic Summary', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11);
      doc.text(`Total Exams Completed: ${studentData.stats.completedExams}`);
      doc.text(`Cumulative Average: ${studentData.stats.averageScore.toFixed(2)}%`);
      doc.text(`Highest Score Achieved: ${studentData.stats.highestScore.toFixed(2)}%`);
      doc.moveDown(1.5);

      // Course Records
      doc.fontSize(14).text('Course Records', { underline: true });
      doc.moveDown(1);

      // Group by subject
      const subjectGroups = {};
      (studentData.submissions || []).forEach(sub => {
        const subject = sub.subjectName || 'General';
        if (!subjectGroups[subject]) {
          subjectGroups[subject] = [];
        }
        subjectGroups[subject].push(sub);
      });

      Object.keys(subjectGroups).forEach(subject => {
        doc.fontSize(12).text(subject, { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10);

        const subs = subjectGroups[subject];
        const avgScore = subs.reduce((acc, s) => acc + (s.maxScore > 0 ? (s.score / s.maxScore) * 100 : 0), 0) / subs.length;

        doc.text(`Exams: ${subs.length}`);
        doc.text(`Average: ${avgScore.toFixed(2)}%`);
        doc.text(`Grade: ${getLetterGrade(avgScore)}`);
        doc.moveDown(1);
      });

      // Certification
      doc.addPage();
      doc.moveDown(5);
      doc.fontSize(12).text('This transcript is a true and accurate record of the student\'s academic performance.', { align: 'center' });
      doc.moveDown(2);
      doc.text(`Issued: ${new Date().toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(3);
      doc.text('_______________________', { align: 'center' });
      doc.text('Authorized Signature', { align: 'center' });

      // Footer
      doc.fontSize(8).text(
        `Transcript ID: ${generateTranscriptId()}`,
        50,
        doc.page.height - 50,
        { align: 'center' }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Helper: Get letter grade
 */
const getLetterGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 85) return 'A';
  if (percentage >= 80) return 'A-';
  if (percentage >= 75) return 'B+';
  if (percentage >= 70) return 'B';
  if (percentage >= 65) return 'B-';
  if (percentage >= 60) return 'C+';
  if (percentage >= 55) return 'C';
  if (percentage >= 50) return 'C-';
  return 'F';
};

/**
 * Helper: Generate transcript ID
 */
const generateTranscriptId = () => {
  return `TR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};
