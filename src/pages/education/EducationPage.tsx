import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, BookOpen, LogOut } from 'lucide-react';
import Sidebar from '@/shared/components/Sidebar';
import Header from '@/shared/components/Header';
import FeedbackButton from '@/feedback/FeedbackButton';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import { sendTestPassed, clearTestState } from '@/features/tests/testsSlice';
import { AppDispatch, RootState } from '@/app/store';
import { getUserDetails } from '@/shared/auth/token';
import styles from './EducationPage.module.css';
import layoutStyles from '@/shared/layout/MainLayout.module.css';
import '@/styles/toast.css';
import '@/styles/confirm.css';
import ToastViewport from '@/shared/components/ToastViewport';
import ConfirmDialog from '@/shared/components/ConfirmDialog';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

const questionsIT: Question[] = [
  {
    id: 1,
    question: "Чем в первую очередь занимается компания T1?",
    options: [
      "Продажа одежды",
      "IT-разработка и цифровые решения",
      "Строительство жилых домов",
      "Производство автомобилей"
    ],
    correctAnswer: "IT-разработка и цифровые решения"
  },
  {
    id: 2,
    question: "Что из этого ближе всего к сфере IT?",
    options: [
      "Серверы и базы данных",
      "Кулинарные рецепты",
      "Сельское хозяйство",
      "Архитектура зданий"
    ],
    correctAnswer: "Серверы и базы данных"
  },
  {
    id: 3,
    question: "Какой язык программирования чаще всего используется для backend-разработки?",
    options: [
      "Python",
      "Java",
      "C++",
      "Все перечисленные могут использоваться"
    ],
    correctAnswer: "Все перечисленные могут использоваться"
  },
  {
    id: 4,
    question: "Что означает аббревиатура \"AI\"?",
    options: [
      "Artificial Intelligence (искусственный интеллект)",
      "Advanced Internet",
      "Automatic Integration",
      "Abstract Information"
    ],
    correctAnswer: "Artificial Intelligence (искусственный интеллект)"
  },
  {
    id: 5,
    question: "Какой из вариантов не является облачным сервисом?",
    options: [
      "Google Drive",
      "Microsoft Azure",
      "AWS (Amazon Web Services)",
      "Windows XP"
    ],
    correctAnswer: "Windows XP"
  }
];

const questionsT1: Question[] = [
  {
    id: 1,
    question: "Какое направление НЕ связано с деятельностью T1?",
    options: [
      "Кибербезопасность",
      "Разработка мобильных приложений",
      "Косметология",
      "Облачные решения"
    ],
    correctAnswer: "Косметология"
  },
  {
    id: 2,
    question: "Какой основной офис T1 в Москве?",
    options: [
      "Башня «Федерация» (Москва-Сити)",
      "Лужники",
      "Красная площадь",
      "МГУ"
    ],
    correctAnswer: "Башня «Федерация» (Москва-Сити)"
  },
  {
    id: 3,
    question: "Какой известный российский бренд ранее назывался «Техносерв» и вошёл в группу T1?",
    options: [
      "Ростелеком",
      "Яндекс",
      "Техносерв",
      "VK"
    ],
    correctAnswer: "Техносерв"
  },
  {
    id: 4,
    question: "Какой из этих терминов точно относится к деятельности T1?",
    options: [
      "Системная интеграция",
      "IT-консалтинг",
      "Цифровизация бизнеса",
      "Все перечисленное"
    ],
    correctAnswer: "Все перечисленное"
  },
  {
    id: 5,
    question: "Сколько лет компании T1 в 2025 году?",
    options: [
      "10 лет",
      "15 лет",
      "23 года",
      "30 лет"
    ],
    correctAnswer: "23 года"
  },
  {
    id: 6,
    question: "Что символизирует название T1?",
    options: [
      "Technology First (Технологии на первом месте)",
      "Team One (Команда №1)",
      "Telecom One (Телеком №1)",
      "Trust One (Доверие прежде всего)"
    ],
    correctAnswer: "Technology First (Технологии на первом месте)"
  }
];

const EducationPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userDetails = getUserDetails();
  const { loading, error, success } = useSelector((state: RootState) => state.tests);
  
  const [isTestMode, setIsTestMode] = useState(false);
  const [selectedTest, setSelectedTest] = useState<'it' | 't1' | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [isTestPassed, setIsTestPassed] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  // Очищаем состояние теста при размонтировании компонента
  useEffect(() => {
    return () => {
      dispatch(clearTestState());
    };
  }, [dispatch]);

  const startTest = (testType: 'it' | 't1') => {
    setSelectedTest(testType);
    setIsTestMode(true);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setTestCompleted(false);
    setScore(0);
    setIsTestPassed(false);
    dispatch(clearTestState());
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    const currentQuestions = selectedTest === 'it' ? questionsIT : questionsT1;
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Тест завершен
      const correctAnswers = userAnswers.filter((answer, index) => 
        answer === currentQuestions[index].correctAnswer
      ).length;
      setScore(correctAnswers);
      setTestCompleted(true);
      
      // Проверяем, пройден ли тест (все вопросы правильно)
      const passed = correctAnswers === currentQuestions.length;
      setIsTestPassed(passed);
      
      // Если тест пройден, отправляем данные на бекенд
      if (passed && userDetails?.id) {
        const testCode = selectedTest === 'it' ? 'TEST_1_PASSED' : 'TEST_2_PASSED';
        dispatch(sendTestPassed({
          userId: userDetails.id,
          testCode: testCode
        }));
      }
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const restartTest = () => {
    setIsTestMode(false);
    setSelectedTest(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setTestCompleted(false);
    setScore(0);
    setIsTestPassed(false);
    dispatch(clearTestState());
  };

  const getProgressPercentage = () => {
    const currentQuestions = selectedTest === 'it' ? questionsIT : questionsT1;
    return ((currentQuestion + 1) / currentQuestions.length) * 100;
  };

     if (!isTestMode) {
     return (
       <div className={layoutStyles.mainLayout}>
         <Sidebar />
         <div className="main-content">
           <Header title="Обучение и развитие" />

                      <div className={styles.educationContainer}>
              <div className={styles.courseSection}>
                <h2 className={styles.courseTitle}>Курсы T1</h2>
                <div className={styles.courseContent}>
                  <div className={styles.courseCard}>
                    <div className={styles.courseIcon}>
                      <Trophy size={48} />
                    </div>
                    <h3>Основы IT</h3>
                    <p>Изучите основы информационных технологий и программирования</p>
                    <button 
                      className={styles.startTestButton}
                      onClick={() => startTest('it')}
                    >
                      Пройти тест по IT
                    </button>
                  </div>
                  
                  <div className={styles.courseCard}>
                    <div className={styles.courseIcon}>
                      <BookOpen size={48} />
                    </div>
                    <h3>Компания T1</h3>
                    <p>Узнайте больше о компании T1, её истории и направлениях деятельности</p>
                    <button 
                      className={styles.startTestButton}
                      onClick={() => startTest('t1')}
                    >
                      Пройти тест о T1
                    </button>
                  </div>
                </div>
              </div>
            </div>
         </div>
         <ToastViewport />
         <ConfirmDialog />
       </div>
     );
   }

     if (testCompleted) {
     const currentQuestions = selectedTest === 'it' ? questionsIT : questionsT1;
     return (
       <div className={layoutStyles.mainLayout}>
         <Sidebar />
         <div className="main-content">
           <Header title="Результаты теста" />

                      <div className={styles.testResults}>
              <div className={styles.resultsCard}>
                <div className={styles.resultsIcon}>
                  {isTestPassed && <Trophy size={64} style={{ color: '#00AAE6' }} />}
               </div>
                <h2>Тест завершен!</h2>
                <div className={styles.scoreDisplay}>
                  <span className={styles.scoreNumber}>{score}</span>
                  <span className={styles.scoreTotal}>из {currentQuestions.length}</span>
                </div>
                <p className={styles.scoreText}>
                  {isTestPassed ? (
                    <>
                      <strong style={{ color: '#00AAE6' }}>Поздравляем! Тест пройден! 🎉</strong><br />
                      Отлично! Вы ответили на все вопросы правильно!
                      {loading && <br />}
                      {loading && <span style={{ fontSize: '14px', color: '#666' }}>Отправляем данные о прохождении...</span>}
                      {success && <br />}
                      {success && <span style={{ fontSize: '14px', color: '#00AAE6' }}>✓ Данные успешно отправлены</span>}
                    </>
                  ) : (
                    <>
                      <strong style={{ color: '#dc3545' }}>Увы, пока не прошли 😔</strong><br />
                      Попробуйте еще раз для лучшего результата!
                    </>
                  )}
                </p>
                <div className={styles.resultsActions}>
                  <button className={styles.restartButton} onClick={restartTest}>
                    Пройти тест заново
                  </button>
                  <button className={styles.backButton} onClick={() => setIsTestMode(false)}>
                    Вернуться к курсу
                  </button>
                </div>
              </div>
            </div>
         </div>
         <ToastViewport />
         <ConfirmDialog />
       </div>
     );
   }

  const currentQuestions = selectedTest === 'it' ? questionsIT : questionsT1;
  const currentQ = currentQuestions[currentQuestion];
  const userAnswer = userAnswers[currentQuestion];

     return (
     <div className={layoutStyles.mainLayout}>
       <Sidebar />
       <div className="main-content">
         <div className="header">
           <div className="header-left">
             <button 
               className="back-button"
               onClick={() => setIsTestMode(false)}
               style={{
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 width: '48px',
                 height: '48px',
                 backgroundColor: '#f8f9fa',
                 border: 'none',
                 borderRadius: '12px',
                 cursor: 'pointer',
                 color: '#333',
                 transition: 'all 0.3s ease'
               }}
               title="Назад к курсу"
             >
               <ArrowLeft size={24} />
             </button>
             <h1 className="page-title">
               {selectedTest === 'it' ? 'Тест: Основы IT' : 'Тест: Компания T1'}
             </h1>
           </div>
           <div className="user-profile">
             <Link 
               to="/achievements-map" 
               style={{ 
                 textDecoration: 'none', 
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: '8px', 
                 padding: '8px 12px', 
                 backgroundColor: '#f8f9fa', 
                 borderRadius: '8px', 
                 color: '#333', 
                 transition: 'all 0.3s ease',
                 fontSize: '14px',
                 fontWeight: '500',
                 cursor: 'pointer',
                 position: 'relative',
                 overflow: 'hidden'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.backgroundColor = '#00AAE6';
                 e.currentTarget.style.color = 'white';
                 e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.backgroundColor = '#f8f9fa';
                 e.currentTarget.style.color = '#333';
                 e.currentTarget.style.transform = 'none';
               }}
             >
               <Trophy size={16} />
               <span>Карта достижений</span>
             </Link>
             <Link 
               to="/profile" 
               style={{ 
                 textDecoration: 'none', 
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: '12px',
                 transition: 'all 0.3s ease',
                 cursor: 'pointer'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'scale(1.05)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'none';
               }}
             >             
               <img className="user-avatar" src={`${userDetails.avatarUrl}`} alt="avatar"  />
               <span className="user-name">{userDetails?.fullname}</span>
             </Link>
             <FeedbackButton />
             <button 
               className="logout-button" 
               onClick={handleLogout} 
               title="Выйти из аккаунта"
               style={{
                 transition: 'all 0.3s ease',
                 cursor: 'pointer'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.color = '#dc3545';
                 e.currentTarget.style.backgroundColor = '#fff5f5';
                 e.currentTarget.style.transform = 'scale(1.1)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.color = '';
                 e.currentTarget.style.backgroundColor = '';
                 e.currentTarget.style.transform = 'none';
               }}
             >
               <LogOut size={20} />
             </button>
           </div>
         </div>

         <div className={styles.testContainer}>
           <div className={styles.testProgress}>
             <div className={styles.progressBar}>
               <div 
                 className={styles.progressFill} 
                 style={{ width: `${getProgressPercentage()}%` }}
               ></div>
             </div>
                          <span className={styles.progressText}>
                Вопрос {currentQuestion + 1} из {currentQuestions.length}
              </span>
           </div>

           <div className={styles.questionCard}>
             <h2 className={styles.questionTitle}>{currentQ.question}</h2>
             
             <div className={styles.optionsContainer}>
               {currentQ.options.map((option, index) => (
                 <label 
                   key={index} 
                   className={`${styles.optionItem} ${userAnswer === option ? styles.selected : ''}`}
                 >
                   <input
                     type="radio"
                     name={`question-${currentQ.id}`}
                     value={option}
                     checked={userAnswer === option}
                     onChange={() => handleAnswerSelect(option)}
                     className={styles.optionInput}
                   />
                   <span className={styles.optionText}>
                     {String.fromCharCode(97 + index)}) {option}
                   </span>
                 </label>
               ))}
             </div>

             <div className={styles.testNavigation}>
               <button 
                 className={styles.navButton}
                 onClick={previousQuestion}
                 disabled={currentQuestion === 0}
               >
                 Назад
               </button>
               
               <button 
                 className={styles.nextButton}
                 onClick={nextQuestion}
                 disabled={!userAnswer}
               >
                                  {currentQuestion === currentQuestions.length - 1 ? 'Завершить тест' : 'Следующий вопрос'}
               </button>
             </div>
           </div>
         </div>
       </div>
       <ToastViewport />
       <ConfirmDialog />
     </div>
   );
};

export default EducationPage;
