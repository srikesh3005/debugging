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

export interface QuizCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
}

export const healthcareQuestions: Question[] = [
  {
    id: 1,
    question: "A Python script for calculating average heart rate crashes with ZeroDivisionError. Why?",
    options: {
      A: "Heart rate values are too high",
      B: "The list of readings is empty",
      C: "Using a string instead of int",
      D: "Python version mismatch"
    },
    correctAnswer: 'B'
  },
  {
    id: 2,
    question: "An API returns 401 Unauthorized when fetching patient records. What is the likely cause?",
    options: {
      A: "Token missing or expired",
      B: "Database is offline",
      C: "Invalid HTML on frontend",
      D: "Bluetooth disconnected"
    },
    correctAnswer: 'A'
  },
  {
    id: 3,
    question: "Login validation fails in a hospital portal even with correct credentials. Cause?",
    options: {
      A: "Wrong font in input box",
      B: "Password hash comparison mismatch",
      C: "Browser zoom level",
      D: "CSS issue"
    },
    correctAnswer: 'B'
  },
  {
    id: 4,
    question: "A chart for displaying patient vitals in JavaScript is not rendering. Why?",
    options: {
      A: "Chart container is hidden",
      B: "JSON data keys mismatch expected format",
      C: "User has no internet",
      D: "Temperature readings too low"
    },
    correctAnswer: 'B'
  },
  {
    id: 5,
    question: "BMI calculation in an app gives wrong results. Cause?",
    options: {
      A: "Incorrect units (e.g., height in cm instead of meters)",
      B: "Using color codes instead of numbers",
      C: "API request timeout",
      D: "Browser cache"
    },
    correctAnswer: 'A'
  },
  {
    id: 6,
    question: "Appointment scheduler shows wrong timezones. Debug?",
    options: {
      A: "Frontend CSS is broken",
      B: "Backend storing UTC but frontend not converting",
      C: "Database is read-only",
      D: "JavaScript minification"
    },
    correctAnswer: 'B'
  },
  {
    id: 7,
    question: "API returns 500 Internal Server Error while fetching patient records. Cause?",
    options: {
      A: "Database field is NULL or missing",
      B: "Internet slow",
      C: "Browser version too old",
      D: "Font mismatch"
    },
    correctAnswer: 'A'
  },
  {
    id: 8,
    question: "Glucose monitor IoT readings stop updating. Cause?",
    options: {
      A: "MQTT connection lost or not subscribed",
      B: "Sensor battery full",
      C: "Screen brightness low",
      D: "Database offline"
    },
    correctAnswer: 'A'
  },
  {
    id: 9,
    question: "React app throws 'component not found.' Likely reason?",
    options: {
      A: "Server port blocked",
      B: "Import path incorrect or file name mismatch",
      C: "JavaScript disabled",
      D: "CSS missing"
    },
    correctAnswer: 'B'
  },
  {
    id: 10,
    question: "Chatbot repeats responses constantly. Debug?",
    options: {
      A: "Internet speed slow",
      B: "HTML validation error",
      C: "Session ID resets on each message",
      D: "Font size too small"
    },
    correctAnswer: 'C'
  },
  {
    id: 11,
    question: "REST API returns CORS error. Fix?",
    options: {
      A: "Update CSS",
      B: "Clear browser cache",
      C: "Restart server",
      D: "Enable Access-Control-Allow-Origin on server"
    },
    correctAnswer: 'D'
  },
  {
    id: 12,
    question: "Billing app calculates wrong totals. Why?",
    options: {
      A: "Font size too small",
      B: "Floating-point precision issues",
      C: "API endpoint blocked",
      D: "Browser theme dark"
    },
    correctAnswer: 'B'
  },
  {
    id: 13,
    question: "Mobile app fails to sync patient reports. Likely cause?",
    options: {
      A: "Icon size incorrect",
      B: "CSS missing",
      C: "Missing internet permission in app manifest",
      D: "User login not required"
    },
    correctAnswer: 'C'
  },
  {
    id: 14,
    question: "Temperature sensor shows negative readings. Debug?",
    options: {
      A: "Internet slow",
      B: "Sensor calibration or ADC formula incorrect",
      C: "Browser zoom high",
      D: "CSS style overrides"
    },
    correctAnswer: 'B'
  },
  {
    id: 15,
    question: "ML model predicts only one class (0% accuracy). Cause?",
    options: {
      A: "Database empty",
      B: "Python version mismatch",
      C: "Imbalanced training data or label encoding error",
      D: "Internet disconnected"
    },
    correctAnswer: 'C'
  },
  {
    id: 16,
    question: "Analytics dashboard shows stale patient data. Debug?",
    options: {
      A: "Screen resolution too low",
      B: "Incorrect CSS",
      C: "Chart font size too large",
      D: "Cache not invalidated or refresh logic missing"
    },
    correctAnswer: 'D'
  },
  {
    id: 17,
    question: "SQL query returns duplicate patient records. Fix?",
    options: {
      A: "Increase font size",
      B: "Use DISTINCT or correct join conditions",
      C: "Clear browser cache",
      D: "Use HTTPS"
    },
    correctAnswer: 'B'
  },
  {
    id: 18,
    question: "Search returns 'undefined' for patient names. Cause?",
    options: {
      A: "Font too small",
      B: "CSS not loaded",
      C: "Null or empty string in JSON response",
      D: "Icon missing"
    },
    correctAnswer: 'C'
  },
  {
    id: 19,
    question: "Telehealth video session fails to connect. Why?",
    options: {
      A: "CSS file missing",
      B: "Browser theme dark",
      C: "Font mismatch",
      D: "Incorrect WebRTC TURN/STUN server credentials"
    },
    correctAnswer: 'D'
  },
  {
    id: 20,
    question: "Image processing script throws 'File not found.' Cause?",
    options: {
      A: "Wrong file path or relative/absolute path mismatch",
      B: "CSS missing",
      C: "Font size too large",
      D: "JavaScript minified"
    },
    correctAnswer: 'A'
  },
  {
    id: 21,
    question: "REST API returns wrong JSON format. Debug?",
    options: {
      A: "Font missing",
      B: "Serialization error (JSON.stringify() or model-to-dict)",
      C: "CSS file not loaded",
      D: "Icon size mismatch"
    },
    correctAnswer: 'B'
  },
  {
    id: 22,
    question: "Notification service sends duplicates. Cause?",
    options: {
      A: "Browser zoom",
      B: "CSS issue",
      C: "Font mismatch",
      D: "Message queue not acknowledged properly"
    },
    correctAnswer: 'D'
  },
  {
    id: 23,
    question: "Wearable health app crashes on startup. Likely reason?",
    options: {
      A: "Browser offline",
      B: "Icon missing",
      C: "Bluetooth initialization or permission missing",
      D: "CSS missing"
    },
    correctAnswer: 'C'
  },
  {
    id: 24,
    question: "Flask dashboard doesn't update after data entry. Debug?",
    options: {
      A: "JavaScript minified",
      B: "Font size mismatch",
      C: "CSS missing",
      D: "Route returns cached template, not fresh database data"
    },
    correctAnswer: 'D'
  },
  {
    id: 25,
    question: "API allows overlapping appointments. Fix?",
    options: {
      A: "Validate time conflicts before inserting into database",
      B: "CSS missing",
      C: "Font too small",
      D: "JS minification"
    },
    correctAnswer: 'A'
  },
  {
    id: 26,
    question: "Django app throws CSRF errors. Debug?",
    options: {
      A: "CSS missing",
      B: "Ensure CSRF token included in AJAX request",
      C: "Font mismatch",
      D: "Database empty"
    },
    correctAnswer: 'B'
  },
  {
    id: 27,
    question: "Backend job for ECG file processing runs infinitely. Cause?",
    options: {
      A: "CSS file missing",
      B: "Font size mismatch",
      C: "Missing termination condition in loop",
      D: "Browser zoom high"
    },
    correctAnswer: 'C'
  },
  {
    id: 28,
    question: "API rate limiter blocks legitimate staff. Fix?",
    options: {
      A: "JavaScript minified",
      B: "Font size mismatch",
      C: "CSS missing",
      D: "Adjust thresholds or whitelist internal IPs"
    },
    correctAnswer: 'D'
  },
  {
    id: 29,
    question: "Angular patient portal doesn't load after deployment. Why?",
    options: {
      A: "Font mismatch",
      B: "Base href or routing config incorrect in production",
      C: "CSS missing",
      D: "Icon missing"
    },
    correctAnswer: 'B'
  },
  {
    id: 30,
    question: "AI recommendation system gives inconsistent results. Debug?",
    options: {
      A: "Backend model version mismatch with test/training version",
      B: "Font mismatch",
      C: "CSS missing",
      D: "Browser offline"
    },
    correctAnswer: 'A'
  }
];

export const dataAnalysisQuestions: Question[] = [
  {
    id: 1,
    question: "df['Total'] = df['Price'] + df['Quantity'] gives NaN values.",
    options: {
      A: "missing values",
      B: "data type mismatch",
      C: "Not a Number",
      D: "none of the above"
    },
    correctAnswer: 'C'
  },
  {
    id: 2,
    question: "df.mean() throws error 'could not convert string to float'.",
    options: {
      A: "numeric field contains a string value",
      B: "string field contains a numeric value",
      C: "numeric field contains NaN value",
      D: "none of the above"
    },
    correctAnswer: 'A'
  },
  {
    id: 3,
    question: "Correct way to drop a column is:",
    options: {
      A: "df.drop('Age')",
      B: "df.drop('Age', axis=1, inplace=True)",
      C: "df.drop('Age',axis=0,inpalce=False)",
      D: "none of the above"
    },
    correctAnswer: 'B'
  },
  {
    id: 4,
    question: "Correct way to filter value is:",
    options: {
      A: "df[df['age'] > 30 and df['salary'] > 50000]",
      B: "df[df('age') > 30 and df('salary') > 50000]",
      C: "(df[df['age'] > 30) & (df['salary'] > 50000])",
      D: "df(df['age'] > 30 & df['salary'] > 50000)"
    },
    correctAnswer: 'C'
  },
  {
    id: 5,
    question: "What will the output of np.mean([1, 2, 3, np.nan]) be?",
    options: {
      A: "syntax error",
      B: "2",
      C: "3",
      D: "nan"
    },
    correctAnswer: 'D'
  },
  {
    id: 6,
    question: "Find the error in the following: df.groupby('Department').mean('Salary')",
    options: {
      A: "mean('salary') must be in small letter",
      B: "mean() doesn't take column names",
      C: "mean('SALARY') must be in caps",
      D: "none of the above"
    },
    correctAnswer: 'B'
  },
  {
    id: 7,
    question: "df.describe(include='all', exclude='object')",
    options: {
      A: "it must be exclude first and then include",
      B: "cannot use both include and exclude simultaneously",
      C: "cannot use all and object",
      D: "none of the above"
    },
    correctAnswer: 'B'
  },
  {
    id: 8,
    question: "If df.fillna(df.mean()) didn't update missing values the reason is:",
    options: {
      A: "there are no missing values",
      B: "must assign back or use inplace=True",
      C: "must assign back",
      D: "must use inplace = True"
    },
    correctAnswer: 'B'
  },
  {
    id: 9,
    question: "Plotting: plt.plot(df['date'], df['sales']); plt.show",
    options: {
      A: "date and sales cannot be plotted",
      B: "it must be only sales",
      C: "it must be only date",
      D: "missing parentheses after plt.show()"
    },
    correctAnswer: 'D'
  },
  {
    id: 10,
    question: "Trying to sort by multiple columns: df.sort_values('City', 'Revenue')",
    options: {
      A: "It must be (['City', 'Revenue'])",
      B: "It must be (('City', 'Revenue'))",
      C: "It must be (['Revenue', 'City'])",
      D: "It must be (['City','Revenue)]"
    },
    correctAnswer: 'A'
  },
  {
    id: 11,
    question: "A Pandas DataFrame operation throws KeyError: 'column_name'. What's the most likely reason?",
    options: {
      A: "Incorrect data type",
      B: "Typo or missing column name in DataFrame",
      C: "Python version issue",
      D: "CSV file too large"
    },
    correctAnswer: 'B'
  },
  {
    id: 12,
    question: "The output of df['col'].mean() is NaN. Why?",
    options: {
      A: "Wrong import statement",
      B: "Function used incorrectly",
      C: "The column contains non-numeric data or all NaN values",
      D: "CSV delimiter issue"
    },
    correctAnswer: 'C'
  },
  {
    id: 13,
    question: "When reading a CSV file, the entire dataset loads into a single column. Debug?",
    options: {
      A: "Dataset corrupted",
      B: "CSV file too small",
      C: "Wrong Python version",
      D: "Wrong delimiter used in pd.read_csv()"
    },
    correctAnswer: 'D'
  },
  {
    id: 14,
    question: "A NumPy operation arr / 0 throws a runtime warning. How to fix?",
    options: {
      A: "Update IDE",
      B: "Change dtype to string",
      C: "Increase array size",
      D: "Replace zeros before division or handle with np.errstate()"
    },
    correctAnswer: 'D'
  },
  {
    id: 15,
    question: "Matplotlib chart shows no figure window. Cause?",
    options: {
      A: "Font error",
      B: "Wrong dataset",
      C: "Missing plt.show()",
      D: "Jupyter cell too small"
    },
    correctAnswer: 'C'
  },
  {
    id: 16,
    question: "The code df.isna().any(axis=1) gives unexpected results. Debug?",
    options: {
      A: "Misunderstanding axis parameter; use axis=0 for columns",
      B: "Missing import",
      C: "DataFrame not loaded",
      D: "CSV file empty"
    },
    correctAnswer: 'A'
  },
  {
    id: 17,
    question: "SQL query returns fewer rows than expected. Cause?",
    options: {
      A: "Too many columns",
      B: "Wrong WHERE condition filtering valid data",
      C: "Database permission issue",
      D: "Table locked"
    },
    correctAnswer: 'B'
  },
  {
    id: 18,
    question: "A correlation heatmap shows all values as NaN. Why?",
    options: {
      A: "Wrong color map",
      B: "Plot size too small",
      C: "Data contains non-numeric or constant columns",
      D: "CSV not saved"
    },
    correctAnswer: 'C'
  },
  {
    id: 19,
    question: "groupby() operation in Pandas gives DataError: No numeric types to aggregate. Cause?",
    options: {
      A: "Wrong version of Pandas",
      B: "Missing import",
      C: "Too many rows",
      D: "All grouped columns are strings or objects"
    },
    correctAnswer: 'D'
  },
  {
    id: 20,
    question: "ValueError: Length mismatch while assigning a list to a DataFrame column. Debug?",
    options: {
      A: "The list length doesn't match DataFrame rows",
      B: "Column name duplicated",
      C: "CSV corrupted",
      D: "dtype mismatch"
    },
    correctAnswer: 'A'
  },
  {
    id: 21,
    question: "TypeError: unsupported operand type(s) during column arithmetic. Cause?",
    options: {
      A: "Wrong library import",
      B: "Mixing strings with numeric columns",
      C: "Column names too long",
      D: "CSV not loaded"
    },
    correctAnswer: 'B'
  },
  {
    id: 22,
    question: "A histogram shows only one bar. Why?",
    options: {
      A: "All data values are identical",
      B: "Plot title missing",
      C: "Color scale wrong",
      D: "Axis labels too small"
    },
    correctAnswer: 'A'
  },
  {
    id: 23,
    question: "Jupyter Notebook shows 'Kernel died' when running analysis. Debug?",
    options: {
      A: "Typo in variable name",
      B: "Missing plt.show()",
      C: "Dataset too large for available memory",
      D: "Incorrect Python path"
    },
    correctAnswer: 'C'
  },
  {
    id: 24,
    question: "SettingWithCopyWarning appears in Pandas. What does it mean?",
    options: {
      A: "Index out of range",
      B: "Modifying a view instead of a copy of DataFrame",
      C: "File path not found",
      D: "Library version mismatch"
    },
    correctAnswer: 'B'
  },
  {
    id: 25,
    question: "After merging two DataFrames, unexpected duplication occurs. Why?",
    options: {
      A: "Plot issue",
      B: "CSV delimiter mismatch",
      C: "Different data types",
      D: "Merge keys contain duplicate values"
    },
    correctAnswer: 'D'
  },
  {
    id: 26,
    question: "SQL query throws ORA-00904: invalid identifier. Debug?",
    options: {
      A: "Wrong column name or missing quotes",
      B: "Data type too long",
      C: "Network timeout",
      D: "Database full"
    },
    correctAnswer: 'A'
  },
  {
    id: 27,
    question: "While plotting, plt.plot(x, y) shows a flat line. Cause?",
    options: {
      A: "Too many colors used",
      B: "y-values all the same or x/y swapped",
      C: "Axis labels missing",
      D: "CSV header wrong"
    },
    correctAnswer: 'B'
  },
  {
    id: 28,
    question: "Data cleaning function drops too many rows. Why?",
    options: {
      A: "Missing parentheses",
      B: "Plot not saved",
      C: "Condition in dropna() or filter too strict",
      D: "CSV delimiter wrong"
    },
    correctAnswer: 'C'
  },
  {
    id: 29,
    question: "Pivot table displays NaN for most cells. Cause?",
    options: {
      A: "Wrong syntax",
      B: "Wrong color map",
      C: "Chart too small",
      D: "Missing values or unmatched keys in group columns"
    },
    correctAnswer: 'D'
  },
  {
    id: 30,
    question: "The saved Excel output has no formatting and extra index column. Debug?",
    options: {
      A: "Use index=False and engine='openpyxl' in to_excel()",
      B: "CSV file corrupted",
      C: "Missing pandas import",
      D: "Wrong data type"
    },
    correctAnswer: 'A'
  }
];

export const socialAppQuestions: Question[] = [
  {
    id: 1,
    question: "What is a social application?",
    options: {
      A: "An app for society at large",
      B: "An app that helps users connect and share content",
      C: "An app for social movement of users",
      D: "An app to solve social issues"
    },
    correctAnswer: 'B'
  },
  {
    id: 2,
    question: "Which language is commonly used to build social media backends?",
    options: {
      A: "HTML",
      B: "CSS",
      C: "Python",
      D: "XML"
    },
    correctAnswer: 'C'
  },
  {
    id: 3,
    question: "What does a database do in a social app?",
    options: {
      A: "Sends emails",
      B: "Stores user data and posts",
      C: "Designs UI",
      D: "Manages sound effects"
    },
    correctAnswer: 'B'
  },
  {
    id: 4,
    question: "What is an API used for?",
    options: {
      A: "To connect frontend and backend of an app",
      B: "To draw graphics",
      C: "To play videos",
      D: "To edit images"
    },
    correctAnswer: 'A'
  },
  {
    id: 5,
    question: "What is the main use of user authentication?",
    options: {
      A: "To decorate the website",
      B: "To add new colors",
      C: "To increase website traffic",
      D: "To verify the identity of users"
    },
    correctAnswer: 'D'
  },
  {
    id: 6,
    question: "What is a 'news feed' in a social application?",
    options: {
      A: "A list of online friends",
      B: "A system for sending notifications",
      C: "A stream of updates and posts from users",
      D: "A video player"
    },
    correctAnswer: 'C'
  },
  {
    id: 7,
    question: "Which technology helps enable real-time chat?",
    options: {
      A: "WebSockets",
      B: "HTML",
      C: "JSON",
      D: "XML"
    },
    correctAnswer: 'A'
  },
  {
    id: 8,
    question: "Why is image compression important in apps?",
    options: {
      A: "To reduce storage and loading time",
      B: "To increase brightness",
      C: "To make images colorful",
      D: "To remove backgrounds"
    },
    correctAnswer: 'A'
  },
  {
    id: 9,
    question: "What does content moderation mean?",
    options: {
      A: "Adding more advertisements",
      B: "Filtering harmful or abusive content",
      C: "Improving graphics quality",
      D: "Increasing likes on posts"
    },
    correctAnswer: 'B'
  },
  {
    id: 10,
    question: "How can social applications handle many users efficiently?",
    options: {
      A: "By deleting old data",
      B: "By reducing app size",
      C: "By using caching and load balancing",
      D: "By disabling login"
    },
    correctAnswer: 'C'
  },
  {
    id: 11,
    question: "A chat feature in a social app shows messages in the wrong order. What is the likely cause?",
    options: {
      A: "Missing sort by timestamp in database query",
      B: "Font mismatch",
      C: "Browser cache full",
      D: "JavaScript minified"
    },
    correctAnswer: 'A'
  },
  {
    id: 12,
    question: "The 'like' count doesn't update until the page is refreshed. What could fix this?",
    options: {
      A: "Increase CSS z-index",
      B: "Compress images",
      C: "Add more JavaScript libraries",
      D: "Use AJAX or WebSocket to update the count dynamically"
    },
    correctAnswer: 'D'
  },
  {
    id: 13,
    question: "User profile pictures fail to load on the feed. What's the most probable cause?",
    options: {
      A: "Database query limit exceeded",
      B: "Wrong file path or missing image URL in backend response",
      C: "Font color conflict",
      D: "CSS padding too small"
    },
    correctAnswer: 'B'
  },
  {
    id: 14,
    question: "A social app's login API keeps returning 400 Bad Request. Why?",
    options: {
      A: "HTML tag mismatch",
      B: "CSS not linked",
      C: "Incorrect JSON body or missing parameters in POST request",
      D: "Font not loaded"
    },
    correctAnswer: 'C'
  },
  {
    id: 15,
    question: "Notifications are delayed by several minutes. What's the likely issue?",
    options: {
      A: "Message queue (e.g., RabbitMQ or Firebase) processing lag",
      B: "Wrong font family",
      C: "Outdated CSS file",
      D: "Browser zoom too high"
    },
    correctAnswer: 'A'
  },
  {
    id: 16,
    question: "User posts disappear after refreshing the page. Why?",
    options: {
      A: "CSS overflow hidden",
      B: "Posts not persisted in database — stored only in frontend state",
      C: "Wrong font color",
      D: "API key expired"
    },
    correctAnswer: 'B'
  },
  {
    id: 17,
    question: "When uploading an image, the app shows 'Unsupported file type.' Debug?",
    options: {
      A: "CSS media query missing",
      B: "Internet too slow",
      C: "MIME type filter doesn't include uploaded file extension",
      D: "Browser cache full"
    },
    correctAnswer: 'C'
  },
  {
    id: 18,
    question: "The search bar in the social app returns no results. Debug?",
    options: {
      A: "Browser not supported",
      B: "CSS font too small",
      C: "API timeout",
      D: "Backend query not filtering or using wrong field name"
    },
    correctAnswer: 'D'
  },
  {
    id: 19,
    question: "Users report their passwords never reset via email. Debug?",
    options: {
      A: "Email server misconfigured or SMTP authentication failed",
      B: "Image upload limit reached",
      C: "Wrong redirect in CSS",
      D: "Database timeout"
    },
    correctAnswer: 'A'
  },
  {
    id: 20,
    question: "A social media app shows duplicate friend requests. Debug?",
    options: {
      A: "JavaScript import missing",
      B: "Backend logic doesn't check if a request already exists",
      C: "Font mismatch",
      D: "Session expired"
    },
    correctAnswer: 'B'
  },
  {
    id: 21,
    question: "Social app feed loads very slowly with many posts. Fix?",
    options: {
      A: "Implement pagination or infinite scroll with lazy loading",
      B: "Reduce CSS file size",
      C: "Change font family",
      D: "Remove all images"
    },
    correctAnswer: 'A'
  },
  {
    id: 22,
    question: "Users can't mention (@) other users in comments. Cause?",
    options: {
      A: "Mention parsing logic missing in backend or frontend",
      B: "CSS color wrong",
      C: "Font too small",
      D: "Browser cache"
    },
    correctAnswer: 'A'
  },
  {
    id: 23,
    question: "Video playback fails on mobile devices. Debug?",
    options: {
      A: "Video format not supported or codec incompatibility",
      B: "CSS animation issue",
      C: "Font mismatch",
      D: "Wrong icon"
    },
    correctAnswer: 'A'
  },
  {
    id: 24,
    question: "Hashtag search returns incorrect posts. Why?",
    options: {
      A: "Database query not matching hashtag format or case sensitivity",
      B: "CSS border missing",
      C: "Font color wrong",
      D: "JavaScript disabled"
    },
    correctAnswer: 'A'
  },
  {
    id: 25,
    question: "Users report seeing other users' private messages. Critical bug - cause?",
    options: {
      A: "Authorization check missing in API endpoint",
      B: "CSS visibility issue",
      C: "Font rendering problem",
      D: "Image compression"
    },
    correctAnswer: 'A'
  },
  {
    id: 26,
    question: "Social app crashes when users upload large images. Fix?",
    options: {
      A: "Add file size validation and compression before upload",
      B: "Change CSS layout",
      C: "Update font library",
      D: "Clear browser cookies"
    },
    correctAnswer: 'A'
  },
  {
    id: 27,
    question: "Real-time notifications don't work on iOS. Debug?",
    options: {
      A: "APNs certificate expired or push notification permission not requested",
      B: "CSS not loaded",
      C: "Font mismatch",
      D: "Icon missing"
    },
    correctAnswer: 'A'
  },
  {
    id: 28,
    question: "User blocking feature doesn't prevent blocked users from viewing profile. Fix?",
    options: {
      A: "Add server-side authorization check in profile API endpoint",
      B: "Update CSS display property",
      C: "Change font color",
      D: "Compress images"
    },
    correctAnswer: 'A'
  },
  {
    id: 29,
    question: "Activity feed shows posts from users who unfollowed. Cause?",
    options: {
      A: "Feed query not filtering by current follower relationships",
      B: "CSS z-index wrong",
      C: "Font too large",
      D: "Browser zoom"
    },
    correctAnswer: 'A'
  },
  {
    id: 30,
    question: "Comment section allows XSS attacks. Critical fix needed?",
    options: {
      A: "Sanitize user input and escape HTML special characters",
      B: "Change CSS padding",
      C: "Update font family",
      D: "Compress images"
    },
    correctAnswer: 'A'
  }
];

export const smartAppQuestions: Question[] = [
  {
    id: 1,
    question: "A smart home lighting app doesn't respond to user commands. What's the most likely cause?",
    options: {
      A: "MQTT broker not connected",
      B: "CSS not loaded",
      C: "Wrong color setting",
      D: "Low screen brightness"
    },
    correctAnswer: 'A'
  },
  {
    id: 2,
    question: "Sensor readings in an IoT dashboard update randomly. Why?",
    options: {
      A: "Wrong CSS grid layout",
      B: "Data sampling rate not synchronized with sensor frequency",
      C: "Database query timeout",
      D: "Browser zoom too high"
    },
    correctAnswer: 'B'
  },
  {
    id: 3,
    question: "A cloud-based smart irrigation system stops after one cycle. Debug?",
    options: {
      A: "Font color mismatch",
      B: "CSS padding issue",
      C: "Infinite loop condition missing or scheduling logic incorrect",
      D: "Sensor battery low"
    },
    correctAnswer: 'C'
  },
  {
    id: 4,
    question: "A mobile smart app cannot connect to a device via Bluetooth. Why?",
    options: {
      A: "Font size mismatch",
      B: "CSS file missing",
      C: "Wrong icon path",
      D: "Missing Bluetooth permission or adapter initialization"
    },
    correctAnswer: 'D'
  },
  {
    id: 5,
    question: "IoT data isn't reaching the cloud server. What's the first thing to check?",
    options: {
      A: "Device internet connectivity and API endpoint URL",
      B: "Font color in dashboard",
      C: "CSS overflow",
      D: "Battery voltage"
    },
    correctAnswer: 'A'
  },
  {
    id: 6,
    question: "The dashboard shows 'NaN' for temperature values. Cause?",
    options: {
      A: "Wrong font",
      B: "Sensor sending string instead of numeric data",
      C: "API key expired",
      D: "CSS flex issue"
    },
    correctAnswer: 'B'
  },
  {
    id: 7,
    question: "Smart parking sensors send duplicate occupancy updates. Debug?",
    options: {
      A: "Database locked",
      B: "CSS hover bug",
      C: "Debouncing or message queue acknowledgment missing",
      D: "API limit exceeded"
    },
    correctAnswer: 'C'
  },
  {
    id: 8,
    question: "An AI-based recommendation system gives identical outputs for all users. Why?",
    options: {
      A: "Database connection slow",
      B: "Wrong CSS color map",
      C: "Training set too large",
      D: "Model not updated with dynamic user data"
    },
    correctAnswer: 'D'
  },
  {
    id: 9,
    question: "A face-recognition smart attendance app fails for new users. Debug?",
    options: {
      A: "Model not retrained with latest face embeddings",
      B: "CSS opacity too low",
      C: "Database query syntax error",
      D: "Wrong HTML tag"
    },
    correctAnswer: 'A'
  },
  {
    id: 10,
    question: "IoT log shows repeated connection attempts. Why?",
    options: {
      A: "CSS class conflict",
      B: "Broker hostname or port incorrect",
      C: "API key missing",
      D: "Dashboard theme wrong"
    },
    correctAnswer: 'B'
  },
  {
    id: 11,
    question: "Smart energy meter values appear inconsistent. Debug?",
    options: {
      A: "Sensor calibration or scaling factor incorrect",
      B: "Font mismatch",
      C: "Chart title missing",
      D: "Wrong color palette"
    },
    correctAnswer: 'A'
  },
  {
    id: 12,
    question: "A mobile smart app doesn't send push notifications. Cause?",
    options: {
      A: "JavaScript commented out",
      B: "CSS color missing",
      C: "Image resolution low",
      D: "FCM/APNS key misconfigured or permission disabled"
    },
    correctAnswer: 'D'
  },
  {
    id: 13,
    question: "The IoT device stops after firmware update. Debug?",
    options: {
      A: "Flash memory overflow or missing bootloader section",
      B: "Font size mismatch",
      C: "CSS class missing",
      D: "Database schema changed"
    },
    correctAnswer: 'A'
  },
  {
    id: 14,
    question: "Data in cloud database appears delayed. Why?",
    options: {
      A: "Latency in MQTT/HTTP data pipeline",
      B: "CSS animation delay",
      C: "Chart not refreshed",
      D: "Timezone mismatch"
    },
    correctAnswer: 'A'
  },
  {
    id: 15,
    question: "Smart camera system restarts frequently. What's the cause?",
    options: {
      A: "CSS overflow hidden",
      B: "Memory leak or insufficient buffer allocation",
      C: "Wrong color encoding",
      D: "Font mismatch"
    },
    correctAnswer: 'B'
  },
  {
    id: 16,
    question: "Sensor values update but dashboard graphs remain static. Debug?",
    options: {
      A: "CSS not applied",
      B: "Frontend not re-rendering — missing state update or WebSocket listener",
      C: "Chart colors wrong",
      D: "HTML tag closed improperly"
    },
    correctAnswer: 'B'
  },
  {
    id: 17,
    question: "IoT device time doesn't match system clock. Cause?",
    options: {
      A: "Database outdated",
      B: "CSS margin wrong",
      C: "NTP synchronization disabled",
      D: "Chart legend hidden"
    },
    correctAnswer: 'C'
  },
  {
    id: 18,
    question: "Voice assistant in smart app doesn't respond to commands. Debug?",
    options: {
      A: "CSS file too large",
      B: "Font mismatch",
      C: "Microphone permission or speech recognition model inactive",
      D: "Wrong redirect URL"
    },
    correctAnswer: 'C'
  },
  {
    id: 19,
    question: "A smart vehicle tracking app shows wrong location. Why?",
    options: {
      A: "Wrong CSS animation",
      B: "Font color too dark",
      C: "GPS module not initialized or incorrect coordinate conversion",
      D: "Image not loaded"
    },
    correctAnswer: 'C'
  },
  {
    id: 20,
    question: "Machine learning inference on edge devices is slow. Debug?",
    options: {
      A: "Wrong thread priority",
      B: "CSS missing",
      C: "Database connection timeout",
      D: "Model not quantized or too large for device memory"
    },
    correctAnswer: 'D'
  },
  {
    id: 21,
    question: "Smart thermostat fails to update settings remotely. Why?",
    options: {
      A: "Theme conflict",
      B: "Chart label missing",
      C: "Wrong CSS flex layout",
      D: "Missing authentication token or endpoint timeout"
    },
    correctAnswer: 'D'
  },
  {
    id: 22,
    question: "IoT device sends incomplete data packets. Debug?",
    options: {
      A: "Buffer size too small or packet fragmentation issue",
      B: "CSS padding missing",
      C: "Wrong database table",
      D: "API path incorrect"
    },
    correctAnswer: 'A'
  },
  {
    id: 23,
    question: "Edge AI camera's object detection misfires in low light. Cause?",
    options: {
      A: "CSS font contrast low",
      B: "Model not trained for low illumination scenarios",
      C: "Image scaling wrong",
      D: "Hardware connection loose"
    },
    correctAnswer: 'B'
  },
  {
    id: 24,
    question: "Smart app dashboard fails to load widgets. Debug?",
    options: {
      A: "Wrong icon set",
      B: "Font mismatch",
      C: "JavaScript import missing or build error in frontend",
      D: "Low screen brightness"
    },
    correctAnswer: 'C'
  },
  {
    id: 25,
    question: "IoT logs show 'Unauthorized access attempt.' Why?",
    options: {
      A: "Data type mismatch",
      B: "Chart legend missing",
      C: "CSS property typo",
      D: "Device certificate expired or token invalid"
    },
    correctAnswer: 'D'
  },
  {
    id: 26,
    question: "Smart farming app shows duplicated sensor entries. Cause?",
    options: {
      A: "Backend not filtering duplicate timestamps",
      B: "Chart overlapping",
      C: "Wrong HTML nesting",
      D: "Image path incorrect"
    },
    correctAnswer: 'A'
  },
  {
    id: 27,
    question: "Data visualization app crashes with 'MemoryError.' Debug?",
    options: {
      A: "Missing CSS link",
      B: "Loading too much data into memory — use chunk processing",
      C: "Chart color overflow",
      D: "Font not imported"
    },
    correctAnswer: 'B'
  },
  {
    id: 28,
    question: "Cloud dashboard throws 'CORS policy blocked' error. Fix?",
    options: {
      A: "Add SSL certificate",
      B: "Rebuild CSS file",
      C: "Enable Access-Control-Allow-Origin header on API server",
      D: "Change browser zoom"
    },
    correctAnswer: 'C'
  },
  {
    id: 29,
    question: "IoT alert system triggers alarms even when readings are normal. Debug?",
    options: {
      A: "Comparison threshold logic reversed or misconfigured",
      B: "Font weight wrong",
      C: "CSS z-index low",
      D: "Database locked"
    },
    correctAnswer: 'A'
  },
  {
    id: 30,
    question: "Cloud IoT dashboard time series graph shows wrong timestamps. Why?",
    options: {
      A: "CSS alignment off with timezone",
      B: "Chart legend hidden with incorrect timezone",
      C: "Incorrect timezone handling or UTC conversion missing",
      D: "JavaScript wrong timezone"
    },
    correctAnswer: 'C'
  }
];

export const quizCategories: QuizCategory[] = [
  {
    id: 'healthcare',
    title: 'Healthcare Debugging',
    description: 'Debug healthcare and medical application issues',
    icon: '🏥',
    questions: healthcareQuestions
  },
  {
    id: 'dataanalysis',
    title: 'Data Analysis',
    description: 'Solve data analysis and pandas debugging challenges',
    icon: '📊',
    questions: dataAnalysisQuestions
  },
  {
    id: 'social',
    title: 'Social Applications',
    description: 'Debug social media and networking app problems',
    icon: '�',
    questions: socialAppQuestions
  },
  {
    id: 'smartapp',
    title: 'Smart Applications',
    description: 'Troubleshoot IoT and smart device applications',
    icon: '🤖',
    questions: smartAppQuestions
  }
];

export const quizQuestions: Question[] = healthcareQuestions;
