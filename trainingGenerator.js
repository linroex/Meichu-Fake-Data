const { faker } = require('@faker-js/faker');

const trainingCourses = [
  'New Employee Orientation',
  'Workplace Safety',
  'Sexual Harassment Prevention',
  'Cybersecurity Awareness',
  'Time Management',
  'Leadership Skills',
  'Project Management Basics',
  'Customer Service Excellence',
  'Diversity and Inclusion',
  'Stress Management'
];

function generateTrainingRecord(employee) {
  const trainingName = faker.helpers.arrayElement(trainingCourses);
  
  // 确保完成日期在雇佣日期之后，但不晚于离职日期（如果有的话）
  const minDate = new Date(employee.hireDate);
  const maxDate = employee.terminationDate ? new Date(employee.terminationDate) : new Date();
  
  const completionDate = faker.date.between({ from: minDate, to: maxDate });
  
  // 设置过期日期，但不超过最大日期
  const expireDate = new Date(completionDate);
  expireDate.setFullYear(expireDate.getFullYear() + 1);
  const finalExpireDate = expireDate > maxDate ? maxDate : expireDate;

  return {
    employeeId: employee.employeeId,
    trainingName: trainingName,
    completionDate: completionDate.toISOString().split('T')[0],
    expireDate: finalExpireDate.toISOString().split('T')[0]
  };
}

function generateTrainingRecords(employees) {
  let allTrainingRecords = [];

  for (const employee of employees) {
    const numberOfTrainings = faker.number.int({ min: 1, max: 5 });
    for (let i = 0; i < numberOfTrainings; i++) {
      allTrainingRecords.push(generateTrainingRecord(employee));
    }
  }

  return allTrainingRecords;
}

module.exports = { generateTrainingRecords };