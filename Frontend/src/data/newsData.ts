
export interface NewsItem {
    id: number;
    title: string;
    category: string;
    image: string;
    source: string;
    date: string;
    excerpt: string;
    content: string; // Detailed content for the details page
    externalLink: string; // URL for "View Full Article"
}

export interface ExamUpdateItem {
    id: number;
    title: string;
    type: string;
    deadline: string;
    eligibility: string;
    link: string;
    important: boolean;
    // Added fields for modal
    image: string;
    source: string;
    content: string;
    category: string; // To normalize with NewsItem for the modal
}

export const techNews: NewsItem[] = [
    {
        id: 1,
        title: 'IBM to skill 5 million Indian youth in AI, Cybersecurity & Quantum by 2030',
        category: 'Skill Development',
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=450&fit=crop',
        source: 'The Times of India',
        date: 'Dec 20, 2025',
        excerpt: 'IBM announces a massive skilling initiative for young learners in India in areas like AI, cybersecurity and quantum computing...',
        content: `IBM has announced a monumental commitment to skill 5 million youth in India by 2030, focusing on deep-tech domains such as Artificial Intelligence (AI), Cybersecurity, and Quantum Computing. This initiative comes at a critical time when the global demand for advanced technical skills is skyrocketing.

**What This Means for Students:**
This program is designed to bridge the gap between academic learning and industry requirements. Students will gain access to IBM’s massive repository of learning resources, certification programs, and hands-on workshops.

**Why It Matters:**
- **Future-Proof Careers:** AI and Quantum Computing are the frontiers of the next technological revolution. Early exposure can set students up for high-paying, impactful careers.
- **Cybersecurity Demand:** With digital adoption growing, the need for security experts is at an all-time high.
- **Access to Resources:** This initiative often includes partnerships with universities and government bodies, making high-quality tech education more accessible.

Students should look out for upcoming bootcamps and digital badge programs offered under this initiative to enhance their resumes.`,
        externalLink: 'https://timesofindia.indiatimes.com/technology/tech-news/ibm-to-skill-5-million-indian-youth-in-ai-cybersecurity-and-quantum-by-2030/articleshow/126082129.cms'
    },
    {
        id: 2,
        title: 'AI in education: Student-centric learning & curriculum innovation',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=450&fit=crop',
        source: 'The Times of India',
        date: 'Dec 19, 2025',
        excerpt: 'India’s Education Minister highlights new reforms to integrate artificial intelligence into school and higher education...',
        content: `India’s Education Minister, Dharmendra Pradhan, has emphasized a major shift towards student-centric learning powered by Artificial Intelligence. The focus is on revolutionizing curriculum innovation in schools and Higher Education Institutions (HEIs) to make learning more personalized and effective.

**The Role of AI in Classrooms:**
The new reforms aim to use AI not just as a subject to learn, but as a tool to aid learning. This includes adaptive learning platforms that adjust to a student's pace, AI-driven assessments that provide instant feedback, and tools that reduce the administrative burden on teachers.

**Impact on Students:**
- **Personalized Paths:** No two students learn the same way. AI can tailor educational content to fit individual learning styles.
- **More Support:** With AI handling routine queries, teachers can focus more on mentorship and complex problem-solving support.
- **Curriculum Relevance:** AI analysis can help update curricula faster, ensuring students learn current and relevant material.

For students, this signals a transition to a more interactive and supportive educational environment where technology acts as a co-pilot in their learning journey.`,
        externalLink: 'https://timesofindia.indiatimes.com/education/news/ai-in-education-dharmendra-pradhan-emphasises-student-centric-learning-teacher-support-and-curriculum-innovation-in-schools-and-heis/articleshow/126069184.cms'
    },
    {
        id: 3,
        title: 'Samsung Innovation Campus powers digital skills for 750 students',
        category: 'Tech News',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=450&fit=crop',
        source: 'The Times of India',
        date: 'Dec 18, 2025',
        excerpt: 'Samsung trains students in programming & AI skills through its Innovation Campus program in Visakhapatnam...',
        content: `Samsung's Innovation Campus program has successfully concluded a significant training drive in Visakhapatnam, powering digital skills for 750 students. The program focused on core technologies like Artifical Intelligence, IoT, and Coding & Programming.

**Bridging the Skills Gap:**
Corporate social responsibility (CSR) initiatives like this are crucial for engineering and polytechnic students. They provide practical, industry-standard training that is often missing in traditional coursework.

**Key Takeaways for Students:**
- **Employability:** Participants in such programs often see a direct boost in employability due to the brand value and rigorous training standards.
- **Hands-on Experience:** The program emphasizes applying concepts to real-world problems, a skill highly valued by recruiters.
- **Networking:** These campuses often connect students with industry mentors and peers from other institutions.

Students should actively monitor news for similar "Innovation Campus" or corporate training cohorts in their regions to seize these free upskilling opportunities.`,
        externalLink: 'https://timesofindia.indiatimes.com/technology/tech-news/samsung-innovation-campus-powers-digital-skills-for-750-students-in-visakhapatnam/articleshow/126057308.cms'
    },
    {
        id: 4,
        title: 'Teacher shortage in Victoria could affect student learning',
        category: 'Global Education',
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=450&fit=crop',
        source: 'Herald Sun',
        date: 'Dec 17, 2025',
        excerpt: 'Ongoing education challenges in Australia with teacher shortages, showing global education pressures...',
        content: `Recent reports from Victoria, Australia, highlight a staggering teacher shortage expected over the next five years, which could significantly impact student learning outcomes. This local issue reflects a broader global trend of straining education systems.

**A Global Challenge:**
While this specific news is from Australia, it mirrors challenges faced by education systems worldwide, including High workload, burnout, and rapid curriculum changes are contributing factors.

**Student Perspective:**
- **Self-Directed Learning:** In environments with fewer resources, students who can take charge of their own learning using online resources and peer groups will thrive.
- **Ed-Tech Opportunities:** This crisis drives the demand for automated / AI-based educational tools, creating a market for new solutions—something computer science students should note.
- **Resilience:** Navigating these structural challenges requires adaptability, a soft skill that is becoming increasingly important.

This serves as a reminder that the education landscape is shifting, and flexibility in how one acquires knowledge is key.`,
        externalLink: 'https://www.heraldsun.com.au/news/victoria/victorian-high-schools-face-staggering-teacher-shortage-over-next-five-years/news-story/30018bcc5546451cfcf8df7c8fbfb8c1'
    }
];

export const examUpdates: ExamUpdateItem[] = [
    {
        id: 1,
        title: 'GATE 2025 Registration Extended',
        type: 'Registration',
        deadline: 'Dec 31, 2025',
        eligibility: 'B.Tech/B.E Final Year',
        link: 'https://gate2025.iitr.ac.in',
        important: true,
        category: 'Exam Update',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop',
        source: 'IIT Roorkee',
        content: `The registration deadline for the Graduate Aptitude Test in Engineering (GATE) 2025 has been extended to December 31, 2025. This extension provides a final opportunity for aspirants who missed the earlier deadline to apply without a late fee.

**About GATE 2025:**
GATE is a prestigious national-level examination that opens doors to postgraduate programs (Master's and Doctoral) in top institutes like IITs, IISc, and NITs. It is also the gateway to lucrative jobs in Public Sector Undertakings (PSUs).

**Key Dates:**
- **Extended Deadline:** Dec 31, 2025
- **Exam Dates:** Feb 1, 2, 15, and 16, 2025

**Eligibility:**
Candidates who are currently in the 3rd or higher year of any undergraduate degree program or have already completed any government-approved degree program in Engineering / Technology / Architecture / Science / Commerce / Arts are eligible.

Don't wait for the last minute—complete your application now on the official portal.`
    },
    {
        id: 2,
        title: 'CAT 2025 Exam Date Announced',
        type: 'Exam Date',
        deadline: 'Nov 24, 2025',
        eligibility: 'Graduates',
        link: 'https://iimcat.ac.in',
        important: false,
        category: 'Entrance Exam',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop',
        source: 'IIM Calcutta',
        content: `The Common Admission Test (CAT) 2025 is scheduled to be held on November 24, 2025. CAT is the premier entrance exam for admission into the prestigious Indian Institutes of Management (IIMs) and other top business schools in India.

**Preparation Strategy:**
With the exam date announced, aspirants effectively have a year to prepare. A structured study plan focusing on Quantitative Ability (QA), Verbal Ability & Reading Comprehension (VARC), and Data Interpretation & Logical Reasoning (DILR) is essential.

**Who Should Apply:**
Any graduate with at least 50% marks (45% for reserved categories) is eligible to apply. Final year students can also apply provisionally.

Start your preparation early to gain a competitive edge.`
    },
    {
        id: 3,
        title: 'UPSC CSE Prelims 2025 Notification',
        type: 'Notification',
        deadline: 'Feb 15, 2025',
        eligibility: 'Graduates (21-32 years)',
        link: 'https://upsc.gov.in',
        important: true,
        category: 'Civil Services',
        image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&h=450&fit=crop',
        source: 'UPSC',
        content: `The Union Public Service Commission (UPSC) has released the notification for the Civil Services (Preliminary) Examination, 2025. This exam serves as the first stage for recruitment into the IAS, IPS, IFS, and other central services.

**Important Details:**
- **Application Start:** Feb 1, 2025
- **Deadline:** Feb 15, 2025
- **Exam Date:** May 26, 2025

**Eligibility Criteria:**
- **Age:** 21 to 32 years (relaxations apply)
- **Education:** Degree from a recognized university.

Aspirants are advised to read the notification carefully regarding the syllabus and optional subjects before applying.`
    },
    {
        id: 4,
        title: 'JEE Main 2025 Session 1',
        type: 'Registration',
        deadline: 'Jan 15, 2025',
        eligibility: '12th Pass/Appearing',
        link: 'https://jeemain.nta.nic.in',
        important: false,
        category: 'Engineering',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=450&fit=crop',
        source: 'NTA',
        content: `Registration for the Joint Entrance Examination (JEE) Main 2025 Session 1 is currently open. JEE Main is the undergraduate engineering admission test for NITs, IIITs, and other Centrally Funded Technical Institutes (CFTIs).

**Session 1 Schedule:**
- **Exam Dates:** Jan 24 to Feb 1, 2025
- **Last Date to Apply:** Jan 15, 2025

**Why Apply for Session 1?**
Attempting Session 1 gives students a chance to understand the exam pattern and secure a score. If not satisfied, they can attempt Session 2 in April and the best of the two scores will be considered.

Ensure all documents and photographs are uploaded as per the specified format to avoid rejection.`
    },
    {
        id: 5,
        title: 'IBPS PO Recruitment 2025',
        type: 'Notification',
        deadline: 'Jan 20, 2025',
        eligibility: 'Graduates (20-30 years)',
        link: 'https://ibps.in',
        important: true,
        category: 'Banking',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=450&fit=crop',
        source: 'IBPS',
        content: `The Institute of Banking Personnel Selection (IBPS) has invited applications for the recruitment of Probationary Officers (PO) / Management Trainees in participating banks for the year 2025-26.

**Vacancy Details:**
The recruitment drive aims to fill over 3000+ vacancies across various public sector banks. It is one of the most sought-after banking exams in the country.

**Selection Process:**
1. Preliminary Exam
2. Main Exam
3. Interview

**Eligibility:**
Any graduate between 20 and 30 years of age can apply.

Banking careers offer stability and growth. Interested candidates should apply online before the closing date.`
    },
];
