// Full German curriculum structured by CEFR levels
export const curriculum = [
  {
    id: 'a1', level: 'A1', title: 'Beginner', description: 'Start your German journey', color: '#58CC02',
    modules: [
      { id: 'a1-alphabet', title: 'Alphabet & Sounds', icon: '🔤', description: 'German letters, umlauts & pronunciation',
        lessons: [
          { id: 'a1-alph-1', title: 'A-F: The First Letters', exercises: 'a1-alph-1' },
          { id: 'a1-alph-2', title: 'G-L: More Consonants', exercises: 'a1-alph-2' },
          { id: 'a1-alph-3', title: 'M-R: Middle Alphabet', exercises: 'a1-alph-3' },
          { id: 'a1-alph-4', title: 'S-Z: Final Letters', exercises: 'a1-alph-4' },
          { id: 'a1-alph-5', title: 'Umlauts: ä, ö, ü & ß', exercises: 'a1-alph-5' },
        ]
      },
      { id: 'a1-greetings', title: 'Greetings', icon: '👋', description: 'Say hello and introduce yourself',
        lessons: [
          { id: 'a1-greet-1', title: 'Hello & Goodbye', exercises: 'a1-greet-1' },
          { id: 'a1-greet-2', title: 'What is your name?', exercises: 'a1-greet-2' },
          { id: 'a1-greet-3', title: 'Where are you from?', exercises: 'a1-greet-3' },
          { id: 'a1-greet-4', title: 'How are you?', exercises: 'a1-greet-4' },
        ]
      },
      { id: 'a1-numbers', title: 'Numbers', icon: '🔢', description: 'Count from 0 to 100',
        lessons: [
          { id: 'a1-num-1', title: 'Numbers 0-10', exercises: 'a1-num-1' },
          { id: 'a1-num-2', title: 'Numbers 11-20', exercises: 'a1-num-2' },
          { id: 'a1-num-3', title: 'Numbers 21-100', exercises: 'a1-num-3' },
        ]
      },
      { id: 'a1-time', title: 'Time & Days', icon: '🕐', description: 'Days, months and telling time',
        lessons: [
          { id: 'a1-time-1', title: 'Days of the Week', exercises: 'a1-time-1' },
          { id: 'a1-time-2', title: 'Months & Seasons', exercises: 'a1-time-2' },
          { id: 'a1-time-3', title: 'Telling Time', exercises: 'a1-time-3' },
        ]
      },
      { id: 'a1-articles', title: 'Articles & Nouns', icon: '📝', description: 'der, die, das',
        lessons: [
          { id: 'a1-art-1', title: 'Der, Die, Das', exercises: 'a1-art-1' },
          { id: 'a1-art-2', title: 'Noun Genders', exercises: 'a1-art-2' },
          { id: 'a1-art-3', title: 'Plural Formation', exercises: 'a1-art-3' },
        ]
      },
      { id: 'a1-verbs', title: 'Basic Verbs', icon: '🏃', description: 'sein, haben & present tense',
        lessons: [
          { id: 'a1-verb-1', title: 'Sein (to be)', exercises: 'a1-verb-1' },
          { id: 'a1-verb-2', title: 'Haben (to have)', exercises: 'a1-verb-2' },
          { id: 'a1-verb-3', title: 'Regular Verbs', exercises: 'a1-verb-3' },
        ]
      },
      { id: 'a1-family', title: 'Family', icon: '👨‍👩‍👧', description: 'Family members',
        lessons: [
          { id: 'a1-fam-1', title: 'Family Members', exercises: 'a1-fam-1' },
          { id: 'a1-fam-2', title: 'Describing People', exercises: 'a1-fam-2' },
        ]
      },
      { id: 'a1-food', title: 'Food & Drinks', icon: '🍽️', description: 'Ordering food',
        lessons: [
          { id: 'a1-food-1', title: 'Fruits & Vegetables', exercises: 'a1-food-1' },
          { id: 'a1-food-2', title: 'Drinks', exercises: 'a1-food-2' },
          { id: 'a1-food-3', title: 'At the Restaurant', exercises: 'a1-food-3' },
        ]
      },
      { id: 'a1-colors', title: 'Colors', icon: '🎨', description: 'Colors and adjectives',
        lessons: [
          { id: 'a1-col-1', title: 'Basic Colors', exercises: 'a1-col-1' },
          { id: 'a1-col-2', title: 'Describing Things', exercises: 'a1-col-2' },
        ]
      },
      { id: 'a1-sentences', title: 'Sentences', icon: '💬', description: 'Your first sentences',
        lessons: [
          { id: 'a1-sent-1', title: 'Word Order', exercises: 'a1-sent-1' },
          { id: 'a1-sent-2', title: 'Questions', exercises: 'a1-sent-2' },
          { id: 'a1-sent-3', title: 'Negation', exercises: 'a1-sent-3' },
        ]
      },
    ]
  },
  {
    id: 'a2', level: 'A2', title: 'Elementary', description: 'Expand your skills', color: '#49C0F8',
    modules: [
      { id: 'a2-past', title: 'Past Tense', icon: '⏪', description: 'Perfekt tense',
        lessons: [
          { id: 'a2-past-1', title: 'Perfekt with haben', exercises: 'a2-past-1' },
          { id: 'a2-past-2', title: 'Perfekt with sein', exercises: 'a2-past-2' },
          { id: 'a2-past-3', title: 'Irregular Participles', exercises: 'a2-past-3' },
        ]
      },
      { id: 'a2-modal', title: 'Modal Verbs', icon: '🔑', description: 'können, müssen, wollen',
        lessons: [
          { id: 'a2-mod-1', title: 'Können & Dürfen', exercises: 'a2-mod-1' },
          { id: 'a2-mod-2', title: 'Müssen & Sollen', exercises: 'a2-mod-2' },
          { id: 'a2-mod-3', title: 'Wollen & Möchten', exercises: 'a2-mod-3' },
        ]
      },
      { id: 'a2-cases', title: 'Cases', icon: '📐', description: 'Accusative & Dative',
        lessons: [
          { id: 'a2-case-1', title: 'Accusative Case', exercises: 'a2-case-1' },
          { id: 'a2-case-2', title: 'Dative Case', exercises: 'a2-case-2' },
          { id: 'a2-case-3', title: 'Prepositions', exercises: 'a2-case-3' },
        ]
      },
      { id: 'a2-daily', title: 'Daily Life', icon: '☀️', description: 'Routines and hobbies',
        lessons: [
          { id: 'a2-daily-1', title: 'Morning Routine', exercises: 'a2-daily-1' },
          { id: 'a2-daily-2', title: 'Hobbies', exercises: 'a2-daily-2' },
          { id: 'a2-daily-3', title: 'Weekend Plans', exercises: 'a2-daily-3' },
        ]
      },
      { id: 'a2-travel', title: 'Travel', icon: '✈️', description: 'Navigate in German',
        lessons: [
          { id: 'a2-trav-1', title: 'At the Station', exercises: 'a2-trav-1' },
          { id: 'a2-trav-2', title: 'Directions', exercises: 'a2-trav-2' },
          { id: 'a2-trav-3', title: 'At the Hotel', exercises: 'a2-trav-3' },
        ]
      },
      { id: 'a2-shopping', title: 'Shopping', icon: '🛒', description: 'Buy things',
        lessons: [
          { id: 'a2-shop-1', title: 'At the Shop', exercises: 'a2-shop-1' },
          { id: 'a2-shop-2', title: 'Prices & Paying', exercises: 'a2-shop-2' },
        ]
      },
    ]
  },
  {
    id: 'b1', level: 'B1', title: 'Intermediate', description: 'Handle everyday situations', color: '#CE82FF',
    modules: [
      { id: 'b1-konj', title: 'Konjunktiv II', icon: '🌀', description: 'Subjunctive & wishes',
        lessons: [
          { id: 'b1-konj-1', title: 'Wishes with würde', exercises: 'b1-konj-1' },
          { id: 'b1-konj-2', title: 'If-Clauses', exercises: 'b1-konj-2' },
        ]
      },
      { id: 'b1-relative', title: 'Relative Clauses', icon: '🔗', description: 'Complex sentences',
        lessons: [
          { id: 'b1-rel-1', title: 'Relative Pronouns', exercises: 'b1-rel-1' },
          { id: 'b1-rel-2', title: 'Building Clauses', exercises: 'b1-rel-2' },
        ]
      },
      { id: 'b1-genitive', title: 'Genitive Case', icon: '👑', description: 'Possession',
        lessons: [
          { id: 'b1-gen-1', title: 'Genitive Articles', exercises: 'b1-gen-1' },
          { id: 'b1-gen-2', title: 'Genitive Prepositions', exercises: 'b1-gen-2' },
        ]
      },
      { id: 'b1-connectors', title: 'Connectors', icon: '🧩', description: 'weil, obwohl, damit',
        lessons: [
          { id: 'b1-conn-1', title: 'Because & Although', exercises: 'b1-conn-1' },
          { id: 'b1-conn-2', title: 'Before & After', exercises: 'b1-conn-2' },
        ]
      },
      { id: 'b1-work', title: 'Work & Career', icon: '💼', description: 'Jobs and interviews',
        lessons: [
          { id: 'b1-work-1', title: 'Job Vocabulary', exercises: 'b1-work-1' },
          { id: 'b1-work-2', title: 'Job Interview', exercises: 'b1-work-2' },
        ]
      },
    ]
  },
  {
    id: 'b2', level: 'B2', title: 'Upper Intermediate', description: 'Express yourself fluently', color: '#FF9600',
    modules: [
      { id: 'b2-passive', title: 'Passive Voice', icon: '🔄', description: 'werden + participle',
        lessons: [
          { id: 'b2-pass-1', title: 'Present Passive', exercises: 'b2-pass-1' },
          { id: 'b2-pass-2', title: 'Past Passive', exercises: 'b2-pass-2' },
        ]
      },
      { id: 'b2-idioms', title: 'Idioms', icon: '🗣️', description: 'German expressions',
        lessons: [
          { id: 'b2-idiom-1', title: 'Common Idioms', exercises: 'b2-idiom-1' },
          { id: 'b2-idiom-2', title: 'Informal Speech', exercises: 'b2-idiom-2' },
        ]
      },
      { id: 'b2-debate', title: 'Opinion & Debate', icon: '⚖️', description: 'Argue your views',
        lessons: [
          { id: 'b2-debate-1', title: 'Stating Opinions', exercises: 'b2-debate-1' },
          { id: 'b2-debate-2', title: 'Agreeing & Disagreeing', exercises: 'b2-debate-2' },
        ]
      },
    ]
  },
  {
    id: 'c1', level: 'C1', title: 'Advanced', description: 'Near-native proficiency', color: '#FF4B4B',
    modules: [
      { id: 'c1-grammar', title: 'Advanced Grammar', icon: '🏛️', description: 'Complex structures',
        lessons: [
          { id: 'c1-gram-1', title: 'Participial Constructions', exercises: 'c1-gram-1' },
          { id: 'c1-gram-2', title: 'Extended Attributes', exercises: 'c1-gram-2' },
        ]
      },
      { id: 'c1-professional', title: 'Professional', icon: '📋', description: 'Business German',
        lessons: [
          { id: 'c1-prof-1', title: 'Business Writing', exercises: 'c1-prof-1' },
          { id: 'c1-prof-2', title: 'Negotiations', exercises: 'c1-prof-2' },
        ]
      },
    ]
  },
  {
    id: 'c2', level: 'C2', title: 'Mastery', description: 'Complete fluency', color: '#FFC800',
    modules: [
      { id: 'c2-fluency', title: 'Native Fluency', icon: '🌟', description: 'Nuances & style',
        lessons: [
          { id: 'c2-flu-1', title: 'Stylistic Nuances', exercises: 'c2-flu-1' },
          { id: 'c2-flu-2', title: 'Regional Varieties', exercises: 'c2-flu-2' },
        ]
      },
      { id: 'c2-exam', title: 'Exam Prep', icon: '🎯', description: 'Goethe C2 & TestDaF',
        lessons: [
          { id: 'c2-exam-1', title: 'Exam Strategies', exercises: 'c2-exam-1' },
          { id: 'c2-exam-2', title: 'Practice Tests', exercises: 'c2-exam-2' },
        ]
      },
    ]
  },
];

export function getLessonById(lessonId) {
  for (const level of curriculum) {
    for (const mod of level.modules) {
      const lesson = mod.lessons.find(l => l.id === lessonId);
      if (lesson) return { ...lesson, module: mod, level };
    }
  }
  return null;
}

export function getModuleById(moduleId) {
  for (const level of curriculum) {
    const mod = level.modules.find(m => m.id === moduleId);
    if (mod) return { ...mod, level };
  }
  return null;
}

export function getModuleProgress(moduleId, completedLessons) {
  for (const level of curriculum) {
    const mod = level.modules.find(m => m.id === moduleId);
    if (mod) {
      const total = mod.lessons.length;
      const done = mod.lessons.filter(l => completedLessons.includes(l.id)).length;
      return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
    }
  }
  return { total: 0, done: 0, percent: 0 };
}

export function isModuleUnlocked(moduleId, completedLessons) {
  for (const level of curriculum) {
    for (let i = 0; i < level.modules.length; i++) {
      if (level.modules[i].id === moduleId) {
        if (i === 0) {
          if (level.id === 'a1') return true;
          const prevIdx = curriculum.findIndex(l => l.id === level.id) - 1;
          if (prevIdx < 0) return true;
          const prevLevel = curriculum[prevIdx];
          const lastMod = prevLevel.modules[prevLevel.modules.length - 1];
          return lastMod.lessons.every(l => completedLessons.includes(l.id));
        }
        const prevMod = level.modules[i - 1];
        const prev = getModuleProgress(prevMod.id, completedLessons);
        return prev.percent >= 50;
      }
    }
  }
  return false;
}
