export interface Question {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export const quizQuestions: Question[] = [
  {
    id: 1,
    question: "What will console.log(typeof (10)) output?",
    options: {
      A: "'null'",
      B: "'object'",
      C: "'undefined'",
      D: "'number'"
    },
    correctAnswer: 'D'
  },
  {
    id: 2,
    question: "Which of these will NOT cause a ReferenceError?",
    options: {
      A: "console.log(x); let x = 5;",
      B: "console.log(y); var y = 5;",
      C: "console.log(z);",
      D: "const a = b;"
    },
    correctAnswer: 'B'
  },
  {
    id: 3,
    question: "What's the output: console.log(0.1 + 0.2 === 0.3)?",
    options: {
      A: "true",
      B: "false",
      C: "undefined",
      D: "NaN"
    },
    correctAnswer: 'B'
  },
  {
    id: 4,
    question: "What does '1' + 1 + 1 evaluate to?",
    options: {
      A: "3",
      B: "'3'",
      C: "'111'",
      D: "NaN"
    },
    correctAnswer: 'C'
  },
  {
    id: 5,
    question: "Which is the correct way to check if an array is empty?",
    options: {
      A: "if (arr)",
      B: "if (arr.length === 0)",
      C: "if (!arr)",
      D: "if (arr == [])"
    },
    correctAnswer: 'B'
  },
  {
    id: 6,
    question: "What's the output: console.log([] == ![])?",
    options: {
      A: "false",
      B: "true",
      C: "undefined",
      D: "TypeError"
    },
    correctAnswer: 'B'
  },
  {
    id: 7,
    question: "How do you properly clone an object in JavaScript?",
    options: {
      A: "const copy = obj;",
      B: "const copy = Object.assign({}, obj);",
      C: "const copy = obj.clone();",
      D: "const copy = new Object(obj);"
    },
    correctAnswer: 'B'
  },
  {
    id: 8,
    question: "What will [...'Hello'] produce?",
    options: {
      A: "['Hello']",
      B: "['H', 'e', 'l', 'l', 'o']",
      C: "Error",
      D: "'Hello'"
    },
    correctAnswer: 'B'
  },
  {
    id: 9,
    question: "Which method removes the last element from an array?",
    options: {
      A: "shift()",
      B: "pop()",
      C: "slice(-1)",
      D: "splice(-1)"
    },
    correctAnswer: 'B'
  },
  {
    id: 10,
    question: "What's the output: console.log(typeof NaN)?",
    options: {
      A: "'NaN'",
      B: "'undefined'",
      C: "'number'",
      D: "'object'"
    },
    correctAnswer: 'C'
  }
];
