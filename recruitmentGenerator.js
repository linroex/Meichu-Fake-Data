const { faker } = require('@faker-js/faker');

const generateRecruitmentRecords = (employees, averageInterviewsPerEmployee = 5) => {
  const recruitmentRecords = [];

  // 工程師職位列表
  const engineerPositions = [
    'Software Engineer',
    'Frontend Engineer',
    'Backend Engineer',
    'Full Stack Engineer',
    'DevOps Engineer',
    'Data Engineer',
    'Machine Learning Engineer',
    'AI Engineer',
    'Cloud Engineer',
    'Security Engineer'
  ];

  employees.forEach(employee => {
    const numberOfInterviews = faker.number.int({ min: 1, max: averageInterviewsPerEmployee * 2 });

    // 設置最早可能的申請日期為 1996-01-01
    const earliestPossibleDate = new Date('1996-01-01');
    
    // 設置最晚可能的申請日期為入職日期前 30 天或 1996-01-01，取較晚者
    const latestPossibleDate = new Date(Math.max(
      new Date(employee.hireDate).getTime() - 30 * 24 * 60 * 60 * 1000,
      earliestPossibleDate.getTime()
    ));

    // 如果最晚可能日期早於最早可能日期，則跳過此員工的記錄生成
    if (latestPossibleDate < earliestPossibleDate) {
      console.warn(`警告: 員工 ID ${employee.employeeId} 的入職日期過早，無法生成有效的申請記錄。`);
      return; // 跳過此次迭代
    }

    for (let i = 0; i < numberOfInterviews; i++) {
      // 生成申請日期
      const applicationDate = faker.date.between({ from: earliestPossibleDate, to: latestPossibleDate });
      
      // 設置最晚可能的面試日期為入職日期前 7 天或申請日期，取較晚者
      const latestInterviewDate = new Date(Math.max(
        new Date(employee.hireDate).getTime() - 7 * 24 * 60 * 60 * 1000,
        applicationDate.getTime()
      ));

      // 生成面試日期（在申請日期和最晚可能的面試日期之間）
      const interviewDate = faker.date.between({ from: applicationDate, to: latestInterviewDate });

      let status;
      if (i === numberOfInterviews - 1 && employee.status !== 'Terminated') {
        status = 'hired';
      } else {
        status = faker.helpers.arrayElement(['applied', 'interviewed', 'rejected']);
      }

      // 決定職位：50% 的機會是工程師職位
      let positionAppliedFor;
      if (faker.datatype.boolean()) {
        positionAppliedFor = faker.helpers.arrayElement(engineerPositions);
      } else {
        positionAppliedFor = faker.person.jobTitle();
      }

      const record = {
        employeeId: employee.employeeId,
        positionAppliedFor: positionAppliedFor,
        applicationDate: applicationDate.toISOString().split('T')[0],
        interviewDate: interviewDate.toISOString().split('T')[0],
        status: status
      };

      recruitmentRecords.push(record);
    }
  });

  return recruitmentRecords;
};

module.exports = { generateRecruitmentRecords };