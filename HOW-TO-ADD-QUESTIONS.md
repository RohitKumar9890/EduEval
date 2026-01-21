# 📝 How to Add Questions to Exams

## 🎯 Quick Answer:

**You add questions AFTER creating an exam!**

---

## 📋 Step-by-Step Guide:

### **Step 1: Login as Faculty**
1. Go to your app
2. Login with faculty credentials
3. Navigate to **"Exams"** from the menu

### **Step 2: Create an Exam First**
1. Click **"Create Exam"** button
2. Fill in:
   - **Title**: e.g., "Midterm Exam"
   - **Type**: Choose "mcq", "coding", or "both"
   - **Duration**: e.g., 60 minutes
   - **Semester**: Select semester
   - **Subject**: Select subject
   - **Section**: Select section
   - **Start Date/Time**: When exam opens
   - **End Date/Time**: When exam closes
3. Click **"Create"**
4. You'll be redirected to the exam detail page

### **Step 3: Add MCQ Questions**

On the exam detail page:

1. Click the **"MCQ Questions"** tab
2. Click **"Add MCQ Question"** button
3. A modal will open with:

   **Question Details:**
   - **Question Text**: Type your question (e.g., "What is 2 + 2?")
   - **Option 1**: First answer choice
   - **Option 2**: Second answer choice
   - **Option 3**: Third answer choice
   - **Option 4**: Fourth answer choice
   - **Correct Option**: Select which option is correct (0, 1, 2, or 3)
   - **Marks**: Points for this question (e.g., 5)
   - **Difficulty**: easy, medium, or hard

4. Click **"Save"**
5. Question is added to the exam!

**Example MCQ Question:**
```
Question: What is the capital of France?
Option 1: London
Option 2: Paris          ← Correct Answer (index 1)
Option 3: Berlin
Option 4: Madrid
Marks: 5
Difficulty: easy
```

### **Step 4: Add Coding Questions**

On the exam detail page:

1. Click the **"Coding Questions"** tab
2. Click **"Add Coding Question"** button
3. A modal will open with:

   **Question Details:**
   - **Title**: Short name (e.g., "Fibonacci Sequence")
   - **Description**: Full problem description
   - **Language**: javascript, python, java, cpp, or c
   - **Starter Code**: Initial code template (optional)
   - **Test Cases**: Add input/output test cases
   - **Marks**: Points for this question (e.g., 20)
   - **Difficulty**: easy, medium, or hard

4. Click **"Save"**
5. Question is added to the exam!

**Example Coding Question:**
```
Title: Sum Two Numbers
Description: Write a function that takes two numbers and returns their sum.
Language: javascript
Starter Code:
  function sum(a, b) {
    // Your code here
  }
Test Cases:
  - Input: 2, 3 → Expected Output: 5
  - Input: 10, 15 → Expected Output: 25
Marks: 20
Difficulty: easy
```

---

## 🎨 Visual Flow:

```
Login as Faculty
    ↓
Go to "Exams" Page
    ↓
Click "Create Exam"
    ↓
Fill exam details → Click "Create"
    ↓
You're now on Exam Detail Page
    ↓
┌─────────────────────────────────────┐
│  [Details] [MCQ] [Coding] [Submit]  │ ← Tabs
└─────────────────────────────────────┘
         ↓              ↓
    Click "MCQ"    Click "Coding"
         ↓              ↓
  [Add MCQ Question]  [Add Coding Question]
         ↓              ↓
    Fill form      Fill form
         ↓              ↓
    Click "Save"   Click "Save"
         ↓              ↓
    Question Added! Question Added!
```

---

## 🔄 Managing Questions:

### **Edit a Question:**
1. Go to exam detail page
2. Click appropriate tab (MCQ or Coding)
3. Click **"Edit"** button on the question
4. Modal opens with current values
5. Make changes
6. Click **"Save"**

### **Delete a Question:**
1. Go to exam detail page
2. Click appropriate tab (MCQ or Coding)
3. Click **"Delete"** button on the question
4. Confirm deletion
5. Question is removed

### **View All Questions:**
1. Go to exam detail page
2. MCQ tab shows all MCQ questions
3. Coding tab shows all coding questions
4. Each question shows:
   - Question text/title
   - Marks
   - Difficulty
   - Edit/Delete buttons

---

## 📊 Exam Detail Page Layout:

```
┌──────────────────────────────────────────────────┐
│  Exam Title: "Midterm Exam"                      │
│  Type: MCQ | Duration: 60 min | Code: ABC123     │
│  Status: [Draft] or [Published]                  │
│  [Publish] [Back to Exams]                       │
├──────────────────────────────────────────────────┤
│  [Details] [MCQ Questions (3)] [Coding (2)] ...  │ ← Tabs
├──────────────────────────────────────────────────┤
│                                                   │
│  MCQ Questions Tab:                               │
│  ┌──────────────────────────────────────────┐   │
│  │ [Add MCQ Question]                        │   │
│  ├──────────────────────────────────────────┤   │
│  │ Q1. What is 2 + 2?               [Edit]  │   │
│  │     Marks: 5 | Difficulty: easy  [Delete]│   │
│  ├──────────────────────────────────────────┤   │
│  │ Q2. What is the capital of France?       │   │
│  │     Marks: 5 | Difficulty: easy  [Delete]│   │
│  └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

---

## ⚠️ Important Notes:

### **Before Publishing:**
- ✅ Add all questions first
- ✅ Review questions for accuracy
- ✅ Set correct marks for each question
- ✅ Verify correct answers (MCQ)
- ✅ Test coding questions with test cases

### **After Publishing:**
- ⚠️ Exam becomes visible to students
- ⚠️ Students can join using exam code
- ⚠️ You can still edit questions (but be careful!)
- ⚠️ You can unpublish to make it draft again

### **Draft vs Published:**
- **Draft**: Only you can see it, edit freely
- **Published**: Students can see and take the exam

---

## 🎯 Quick Example Workflow:

### **Create a Simple MCQ Quiz:**

1. **Create Exam:**
   - Title: "Week 1 Quiz"
   - Type: "mcq"
   - Duration: 30 minutes

2. **Add Questions:**
   ```
   Q1. What is HTML?
   - Option 1: Programming Language
   - Option 2: Markup Language ✓
   - Option 3: Database
   - Option 4: Framework
   Marks: 5
   
   Q2. CSS stands for?
   - Option 1: Cascading Style Sheets ✓
   - Option 2: Computer Style Sheets
   - Option 3: Creative Style Sheets
   - Option 4: Colorful Style Sheets
   Marks: 5
   
   Q3. Which is a JavaScript framework?
   - Option 1: Django
   - Option 2: Laravel
   - Option 3: React ✓
   - Option 4: Flask
   Marks: 5
   ```

3. **Publish:**
   - Click "Publish" button
   - Share exam code with students

### **Create a Coding Exam:**

1. **Create Exam:**
   - Title: "Programming Assignment 1"
   - Type: "coding"
   - Duration: 120 minutes

2. **Add Questions:**
   ```
   Q1. Fibonacci Sequence
   Description: Write a function that returns the nth Fibonacci number
   Language: python
   Starter Code:
     def fibonacci(n):
         # Your code here
         pass
   Test Cases:
     Input: 0 → Output: 0
     Input: 1 → Output: 1
     Input: 5 → Output: 5
   Marks: 30
   
   Q2. Palindrome Checker
   Description: Check if a string is a palindrome
   Language: python
   Test Cases:
     Input: "racecar" → Output: true
     Input: "hello" → Output: false
   Marks: 20
   ```

3. **Publish:**
   - Click "Publish"
   - Share exam code

---

## 🔍 Where to Find Everything:

### **Faculty Menu:**
```
Dashboard
├── Exams ← Start here!
├── Materials
├── Announcements
└── Submissions
```

### **Exam List Page:**
- Shows all your exams
- **"Create Exam"** button at top

### **Exam Detail Page:**
- After creating or clicking an exam
- Has tabs: Details, MCQ, Coding, Submissions
- This is where you add questions!

---

## 💡 Pro Tips:

1. **Create exam structure first** (title, duration, etc.)
2. **Then add questions** one by one
3. **Keep as draft** while adding questions
4. **Review everything** before publishing
5. **Test with sample student account** if possible
6. **Use exam code** to let students join

---

## 🎓 Students Take Exam Like This:

1. Login as student
2. Go to "Join Exam"
3. Enter exam code (e.g., "ABC123")
4. Click "Join"
5. Take the exam
6. Submit answers

Faculty can then view submissions in the "Submissions" tab!

---

**Need help? The UI is very intuitive - just click "Create Exam" and follow the tabs!** 🚀
