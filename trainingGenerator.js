const { faker } = require('@faker-js/faker');

const generateTrainingRecords = (employees) => {
  const trainingRecords = [];
  const today = new Date();

  const trainingNames = [
    // 軟體開發相關
    'Agile Development Methodologies',
    'DevOps Practices',
    'Cloud Computing Fundamentals',
    'Cybersecurity Essentials',
    'Machine Learning Basics',
    'Data Structures and Algorithms',
    'Version Control with Git',
    'Continuous Integration and Deployment',
    'API Design and Development',
    'Microservices Architecture',
    
    // 工廠生產安全相關
    'Workplace Safety Fundamentals',
    'Hazardous Materials Handling',
    'Emergency Response Procedures',
    'Ergonomics in Manufacturing',
    'Machine Safety and Operation',
    'Personal Protective Equipment Usage',
    'Fire Safety and Prevention',
    'Forklift Operation Safety',
    'Electrical Safety in the Workplace',
    'Chemical Safety and Spill Control',
    
    // 通用技能
    'Leadership and Management Skills',
    'Project Management Fundamentals',
    'Effective Communication Strategies',
    'Time Management and Productivity',
    'Conflict Resolution in the Workplace',
    'Customer Service Excellence',
    'Diversity and Inclusion Training',
    'Stress Management and Well-being',
    'Business Ethics and Compliance',
    'Data Privacy and GDPR Compliance'
  ];

  employees.forEach(employee => {
    const hireDate = new Date(employee.hireDate);
    const numberOfTrainings = faker.number.int({ min: 0, max: 5 });
    const employeeTrainings = new Set(); // 用於追踪該員工已有的培訓

    for (let i = 0; i < numberOfTrainings; i++) {
      let trainingName;
      do {
        trainingName = faker.helpers.arrayElement(trainingNames);
      } while (employeeTrainings.has(trainingName)); // 如果培訓已存在,重新選擇

      employeeTrainings.add(trainingName); // 將新培訓添加到集合中

      const completionDate = faker.date.between({ from: hireDate, to: today });
      
      // 設置過期日期為完成日期後的 1 到 3 年
      const expireDate = new Date(completionDate);
      expireDate.setFullYear(expireDate.getFullYear() + faker.number.int({ min: 1, max: 3 }));

      trainingRecords.push({
        employeeId: employee.employeeId,
        trainingName: trainingName,
        completionDate: completionDate.toISOString().split('T')[0],
        expireDate: expireDate.toISOString().split('T')[0]
      });
    }
  });

  return trainingRecords;
};

module.exports = { generateTrainingRecords };