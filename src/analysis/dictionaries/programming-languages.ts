/**
 * Comprehensive list of programming languages and frameworks
 */

export const programmingKeywords: Record<string, RegExp> = {
  // General Purpose Languages
  'Python': /\bpython\b/gi,
  'Java': /\bjava\b(?!\s*script)/gi,
  'JavaScript': /javascript|js(?:\s+development)?/gi,
  'TypeScript': /typescript/gi,
  'C': /\bC\b(?!\+|\#)/g,
  'C++': /C\+\+|cplusplus/gi,
  'C#': /C\#|C-Sharp|csharp/gi,
  'Ruby': /\bruby\b/gi,
  'PHP': /\bPHP\b/gi,
  'Go': /\bGo\b(?:\s+(?:lang|programming))?/gi,
  'Rust': /\brust\b/gi,
  'Swift': /\bswift\b/gi,
  'Kotlin': /\bkotlin\b/gi,
  'Scala': /\bscala\b/gi,
  'Perl': /\bperl\b/gi,
  'Dart': /\bdart\b/gi,
  'Lua': /\blua\b/gi,
  'Objective-C': /objective-c/gi,
  'Haskell': /\bhaskell\b/gi,
  'Elixir': /\belixir\b/gi,
  'Erlang': /\berlang\b/gi,
  'Clojure': /\bclojure\b/gi,
  'F#': /F\#|fsharp/gi,
  'Julia': /\bjulia\b/gi,
  'Groovy': /\bgroovy\b/gi,

  // Statistical & Data Science
  'R': /\bR\b(?:\s+(?:programming|language))?/g,
  'SAS': /\bSAS\b/gi,
  'MATLAB': /\bMATLAB\b/gi,
  'Octave': /\boctave\b/gi,
  'Stata': /\bstata\b/gi,

  // Database & Query Languages
  'SQL': /\bSQL\b/gi,
  'PL/SQL': /PL\/SQL/gi,
  'T-SQL': /T-SQL/gi,
  'MySQL': /\bmysql\b/gi,
  'PostgreSQL': /postgresql/gi,
  'MongoDB Query': /mongodb/gi,
  'GraphQL': /\bgraphql\b/gi,
  'NoSQL': /\bnosql\b/gi,

  // Web Development - Frontend Frameworks
  'React': /\breact\b(?:\s+(?:js|native))?/gi,
  'Angular': /\bangular\b(?:js)?/gi,
  'Vue.js': /vue(?:\.js)?/gi,
  'Svelte': /\bsvelte\b/gi,
  'Next.js': /next\.js/gi,
  'Nuxt.js': /nuxt\.js/gi,
  'Gatsby': /\bgatsby\b/gi,
  'Ember.js': /ember\.js/gi,
  'Backbone.js': /backbone\.js/gi,
  'jQuery': /\bjquery\b/gi,
  'Bootstrap': /\bbootstrap\b/gi,
  'Tailwind CSS': /tailwind\s*css/gi,
  'Material-UI': /material-ui|mui/gi,
  'Ant Design': /ant\s+design/gi,

  // Web Development - Backend Frameworks
  'Node.js': /node\.js|nodejs/gi,
  'Express.js': /express\.js|expressjs/gi,
  'Django': /\bdjango\b/gi,
  'Flask': /\bflask\b/gi,
  'FastAPI': /fastapi/gi,
  'Spring': /spring\s+(?:boot|framework|mvc)/gi,
  'Ruby on Rails': /ruby\s+on\s+rails|rails/gi,
  'Laravel': /\blaravel\b/gi,
  'Symfony': /\bsymfony\b/gi,
  'ASP.NET': /ASP\.NET/gi,
  '.NET Core': /\.NET\s+Core/gi,
  'NestJS': /nestjs/gi,
  'Koa': /\bkoa\b/gi,
  'Hapi': /\bhapi\b/gi,

  // Mobile Development
  'React Native': /react\s+native/gi,
  'Flutter': /\bflutter\b/gi,
  'SwiftUI': /swiftui/gi,
  'Xamarin': /\bxamarin\b/gi,
  'Ionic': /\bionic\b/gi,
  'Cordova': /\bcordova\b/gi,

  // Game Development
  'Unity': /\bunity\b(?:\s+(?:3d|engine))?/gi,
  'Unreal Engine': /unreal\s+engine/gi,
  'Godot': /\bgodot\b/gi,
  'Cocos2d': /cocos2d/gi,

  // Data Engineering & Big Data
  'Spark': /apache\s+spark|\bspark\b/gi,
  'Hadoop': /\bhadoop\b/gi,
  'Kafka': /\bkafka\b/gi,
  'Airflow': /\bairflow\b/gi,
  'Flink': /\bflink\b/gi,
  'Hive': /\bhive\b/gi,
  'Pig': /\bpig\b/gi,

  // Machine Learning & AI Frameworks
  'TensorFlow': /tensorflow/gi,
  'PyTorch': /pytorch/gi,
  'Keras': /\bkeras\b/gi,
  'scikit-learn': /scikit-learn|sklearn/gi,
  'XGBoost': /xgboost/gi,
  'LightGBM': /lightgbm/gi,
  'OpenCV': /opencv/gi,
  'Pandas': /\bpandas\b/gi,
  'NumPy': /numpy/gi,
  'SciPy': /scipy/gi,

  // Cloud & Infrastructure
  'Terraform': /\bterraform\b/gi,
  'CloudFormation': /cloudformation/gi,
  'Ansible': /\bansible\b/gi,
  'Puppet': /\bpuppet\b/gi,
  'Chef': /\bchef\b/gi,
  'Docker': /\bdocker\b/gi,
  'Kubernetes': /\bkubernetes\b|k8s/gi,

  // Testing Frameworks
  'Jest': /\bjest\b/gi,
  'Mocha': /\bmocha\b/gi,
  'Jasmine': /\bjasmine\b/gi,
  'Pytest': /\bpytest\b/gi,
  'JUnit': /\bjunit\b/gi,
  'TestNG': /testng/gi,
  'Selenium': /\bselenium\b/gi,
  'Cypress': /\bcypress\b/gi,
  'Playwright': /\bplaywright\b/gi,

  // API Development
  'REST API': /REST(?:\s+API)?/gi,
  'RESTful': /restful/gi,
  'gRPC': /\bgrpc\b/gi,
  'SOAP': /\bSOAP\b/gi,
  'Postman': /\bpostman\b/gi,
  'Swagger': /\bswagger\b/gi,
  'OpenAPI': /openapi/gi,

  // Version Control
  'Git': /\bgit\b/gi,
  'GitHub': /\bgithub\b/gi,
  'GitLab': /\bgitlab\b/gi,
  'Bitbucket': /\bbitbucket\b/gi,
  'SVN': /\bSVN\b|subversion/gi,
  'Mercurial': /\bmercurial\b/gi,

  // DevOps & CI/CD
  'Jenkins': /\bjenkins\b/gi,
  'Travis CI': /travis\s+ci/gi,
  'CircleCI': /circleci/gi,
  'GitHub Actions': /github\s+actions/gi,
  'GitLab CI': /gitlab\s+ci/gi,
  'Azure DevOps': /azure\s+devops/gi,
  'Bamboo': /\bbamboo\b/gi,

  // Scripting
  'Bash': /\bbash\b/gi,
  'Shell Scripting': /shell\s+script/gi,
  'PowerShell': /powershell/gi,
  'VBA': /\bVBA\b|visual\s+basic\s+for\s+applications/gi,
  'VBScript': /vbscript/gi,

  // Markup & Styling
  'HTML': /\bHTML\b/gi,
  'CSS': /\bCSS\b/gi,
  'SCSS': /\bSCSS\b/gi,
  'Sass': /\bsass\b/gi,
  'Less': /\bless\b/gi,
  'XML': /\bXML\b/gi,
  'JSON': /\bJSON\b/gi,
  'YAML': /\bYAML\b/gi,
  'Markdown': /\bmarkdown\b/gi,

  // Specialized
  'VHDL': /\bVHDL\b/gi,
  'Verilog': /\bverilog\b/gi,
  'Assembly': /\bassembly\b/gi,
  'COBOL': /\bCOBOL\b/gi,
  'Fortran': /\bfortran\b/gi,
  'APL': /\bAPL\b/gi,
  'Prolog': /\bprolog\b/gi,
  'Lisp': /\blisp\b/gi,
  'Scheme': /\bscheme\b/gi,
  'Solidity': /\bsolidity\b/gi,
  'WebAssembly': /webassembly|wasm/gi,
};
