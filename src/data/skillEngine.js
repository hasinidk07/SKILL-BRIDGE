import { careers } from './sampleData.js'

// Requirements are illustrative prototype benchmarks, not official hiring standards.
// weight controls how strongly a skill contributes to overall career coverage.
export const careerRequirements = {
  'Software Developer': [
    { skill: 'Programming', required: 80, weight: 1.3 },
    { skill: 'Problem Solving', required: 85, weight: 1.3 },
    { skill: 'Data Structures', required: 75, weight: 1.2 },
    { skill: 'Git', required: 65, weight: 0.8 },
  ],
  'Data Analyst': [
    { skill: 'SQL', required: 80, weight: 1.3 },
    { skill: 'Excel', required: 70, weight: 0.9 },
    { skill: 'Statistics', required: 80, weight: 1.2 },
    { skill: 'Data Visualization', required: 75, weight: 1.1 },
  ],
  'AI/ML Engineer': [
    { skill: 'Python', required: 85, weight: 1.2 },
    { skill: 'Mathematics', required: 80, weight: 1.2 },
    { skill: 'Machine Learning', required: 80, weight: 1.4 },
    { skill: 'Statistics', required: 75, weight: 1.0 },
  ],
  'Embedded Systems Engineer': [
    { skill: 'C/C++', required: 85, weight: 1.4 },
    { skill: 'Microcontrollers', required: 80, weight: 1.3 },
    { skill: 'Electronics', required: 75, weight: 1.1 },
    { skill: 'Debugging', required: 70, weight: 0.9 },
  ],
  'VLSI Design Engineer': [
    { skill: 'Digital Logic', required: 85, weight: 1.4 },
    { skill: 'Verilog', required: 80, weight: 1.4 },
    { skill: 'Semiconductor Basics', required: 75, weight: 1.1 },
    { skill: 'Verification', required: 70, weight: 1.0 },
  ],
  'IoT Developer': [
    { skill: 'C/C++', required: 75, weight: 1.1 },
    { skill: 'Networking', required: 75, weight: 1.0 },
    { skill: 'Sensors', required: 80, weight: 1.3 },
    { skill: 'Cloud Basics', required: 65, weight: 0.9 },
  ],
  'Robotics Engineer': [
    { skill: 'Python', required: 75, weight: 1.0 },
    { skill: 'Control Systems', required: 85, weight: 1.4 },
    { skill: 'Sensors', required: 75, weight: 1.1 },
    { skill: 'ROS', required: 70, weight: 1.0 },
  ],
  'Telecommunications Engineer': [
    { skill: 'Networking', required: 80, weight: 1.2 },
    { skill: 'Signal Processing', required: 85, weight: 1.4 },
    { skill: 'Wireless Systems', required: 80, weight: 1.2 },
    { skill: 'Electronics', required: 70, weight: 0.9 },
  ],
}

// One short knowledge check per skill keeps the prototype assessment focused.
export const questionBank = {
  'Programming': { question: 'Which structure is commonly used to repeat a block of code?', options: ['Loop', 'Comment', 'Variable name', 'File path'], answer: 0, explanation: 'Loops repeat a block while a condition is met or for a set number of times.' },
  'Problem Solving': { question: 'What is a good first step when solving a complex coding problem?', options: ['Write random code', 'Break it into smaller steps', 'Skip testing', 'Add more libraries'], answer: 1, explanation: 'Breaking a problem into smaller parts makes it easier to reason about and test.' },
  'Data Structures': { question: 'Which data structure follows First In, First Out (FIFO)?', options: ['Stack', 'Tree', 'Queue', 'Graph'], answer: 2, explanation: 'A queue removes items in the same order they were added.' },
  'Git': { question: 'Which Git command records staged changes in repository history?', options: ['git commit', 'git status', 'git branch', 'git clone'], answer: 0, explanation: 'git commit creates a snapshot of staged changes.' },
  'SQL': { question: 'Which SQL clause filters rows based on a condition?', options: ['ORDER BY', 'WHERE', 'GROUP BY', 'SELECT'], answer: 1, explanation: 'WHERE filters rows before they are returned.' },
  'Excel': { question: 'Which Excel function calculates the arithmetic mean?', options: ['COUNT', 'MAX', 'AVERAGE', 'IF'], answer: 2, explanation: 'AVERAGE returns the arithmetic mean of selected values.' },
  'Statistics': { question: 'Which measure is the middle value in an ordered dataset?', options: ['Mean', 'Median', 'Range', 'Mode'], answer: 1, explanation: 'The median is the middle value after sorting the data.' },
  'Data Visualization': { question: 'Which chart is usually suitable for comparing values across categories?', options: ['Bar chart', 'Scatter map only', 'Code editor', 'Flowchart'], answer: 0, explanation: 'Bar charts make category comparisons easy to read.' },
  'Python': { question: 'Which Python keyword is used to define a function?', options: ['function', 'func', 'def', 'lambda:'], answer: 2, explanation: 'The def keyword begins a named function definition.' },
  'Mathematics': { question: 'What does the derivative of a function represent at a point?', options: ['Its slope or rate of change', 'Its total area', 'Its maximum input', 'Its list of roots'], answer: 0, explanation: 'A derivative represents instantaneous rate of change.' },
  'Machine Learning': { question: 'In supervised learning, training data includes:', options: ['Only images', 'Input examples and target labels', 'No examples', 'Only random numbers'], answer: 1, explanation: 'Supervised models learn from examples paired with known targets.' },
  'C/C++': { question: 'Which symbol commonly ends a statement in C and C++?', options: [':', ';', '#', ','], answer: 1, explanation: 'A semicolon terminates most statements in C and C++.' },
  'Microcontrollers': { question: 'What is a microcontroller primarily designed to do?', options: ['Run embedded control tasks', 'Replace every desktop computer', 'Store web pages', 'Render movies'], answer: 0, explanation: 'A microcontroller combines a processor, memory and peripherals for embedded tasks.' },
  'Electronics': { question: 'Which component is commonly used to limit current in a circuit?', options: ['Resistor', 'Antenna', 'Switch casing', 'Heat sink'], answer: 0, explanation: 'A resistor opposes current flow and can limit current.' },
  'Debugging': { question: 'What is the purpose of a debugger breakpoint?', options: ['Pause execution at a chosen line', 'Delete a function', 'Compile faster', 'Rename a project'], answer: 0, explanation: 'A breakpoint pauses execution so program state can be inspected.' },
  'Digital Logic': { question: 'How many possible output values does a basic AND gate have?', options: ['One', 'Two: 0 or 1', 'Three', 'Four'], answer: 1, explanation: 'Digital logic gates produce a binary output: 0 or 1.' },
  'Verilog': { question: 'Verilog is primarily used to describe:', options: ['Hardware logic', 'Web page styling', 'Database tables', 'Photo editing'], answer: 0, explanation: 'Verilog is a hardware description language used for digital designs.' },
  'Semiconductor Basics': { question: 'A semiconductor has conductivity that is generally:', options: ['Between a conductor and an insulator', 'Always zero', 'Always infinite', 'Unrelated to materials'], answer: 0, explanation: 'Semiconductors have controllable conductivity between conductors and insulators.' },
  'Verification': { question: 'Why is design verification performed?', options: ['To check a design meets its specification', 'To change its colour', 'To remove documentation', 'To avoid testing'], answer: 0, explanation: 'Verification checks whether the design behaves according to its specification.' },
  'Networking': { question: 'What does an IP address identify on an IP network?', options: ['A network interface', 'A programming language', 'A file format', 'A screen size'], answer: 0, explanation: 'An IP address identifies a network interface for communication.' },
  'Sensors': { question: 'What does a sensor do in an electronic system?', options: ['Measures a physical condition', 'Only stores source code', 'Compiles programs', 'Creates a network account'], answer: 0, explanation: 'Sensors detect physical conditions such as light, temperature or distance.' },
  'Cloud Basics': { question: 'What is cloud computing?', options: ['Using computing services over a network', 'Saving files only on paper', 'A type of circuit board', 'A local keyboard shortcut'], answer: 0, explanation: 'Cloud computing provides services such as storage and processing over a network.' },
  'Control Systems': { question: 'What is the main purpose of feedback in a control system?', options: ['Compare output with desired behaviour', 'Remove all sensors', 'Increase file size', 'Disable the controller'], answer: 0, explanation: 'Feedback compares actual output with a target so corrections can be made.' },
  'ROS': { question: 'ROS in robotics is best described as:', options: ['A robotics software framework', 'A type of motor', 'A battery chemistry', 'A web browser'], answer: 0, explanation: 'ROS provides tools and libraries for building robot applications.' },
  'Signal Processing': { question: 'Which operation is commonly used to reduce unwanted frequency components?', options: ['Filtering', 'Formatting', 'Routing', 'Indexing'], answer: 0, explanation: 'Filters retain or suppress selected frequency components.' },
  'Wireless Systems': { question: 'Wireless communication transfers information using:', options: ['Electromagnetic waves', 'Only copper cables', 'Printed labels', 'Mechanical gears'], answer: 0, explanation: 'Wireless systems transmit information through electromagnetic waves.' },
}

export function getRequirements(careerName) {
  return careerRequirements[careerName] || careerRequirements['Software Developer']
}

export function calculateSkillGaps(careerName, assessedSkills = {}) {
  const requirements = getRequirements(careerName)
  const rows = requirements.map((requirement) => {
    const matchedKey = Object.keys(assessedSkills).find((key) => key.trim().toLowerCase() === requirement.skill.trim().toLowerCase())
    const assessed = matchedKey ? Number(assessedSkills[matchedKey]) : 0
    const current = Number.isFinite(assessed) ? Math.max(0, Math.min(100, assessed)) : 0
    const gap = Math.max(0, requirement.required - current)
    return {
      ...requirement,
      current,
      gap,
      matched: Boolean(matchedKey),
      priorityScore: Math.round(gap * requirement.weight),
      priority: gap >= 40 ? 'High' : gap >= 20 ? 'Medium' : gap > 0 ? 'Low' : 'On track',
    }
  })
  const totalWeight = requirements.reduce((sum, item) => sum + item.weight, 0)
  const coverage = totalWeight
    ? Math.round(rows.reduce((sum, item) => sum + Math.min(item.current, item.required) / item.required * item.weight, 0) / totalWeight * 100)
    : 0
  const averageScore = rows.length ? Math.round(rows.reduce((sum, item) => sum + item.current, 0) / rows.length) : 0
  const missingSkills = rows.filter((item) => !item.matched || item.gap > 0).sort((a, b) => b.priorityScore - a.priorityScore)
  return { career: careerName, rows, coverage, averageScore, missingSkills, assessedCount: rows.filter((item) => item.matched).length }
}

export function getCareerNames() {
  return careers.map((career) => career.name)
}
