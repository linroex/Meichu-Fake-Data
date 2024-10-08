const { faker } = require('@faker-js/faker');

const generateAwardRecords = (employees) => {
  const startTime = Date.now();
  const timeout = 30000; // 30 秒超時
  const awardRecords = [];
  const today = new Date();

  const awards = [
    { name: 'Employee of the Year', desc: 'Outstanding overall performance and contribution' },
    { name: 'Outstanding Performance Award', desc: 'Exceptional achievement in role responsibilities' },
    { name: 'Innovation Excellence Award', desc: 'Groundbreaking ideas and creative solutions' },
    { name: 'Leadership Recognition Award', desc: 'Exemplary leadership and team management' },
    { name: 'Customer Service Champion', desc: 'Superior customer satisfaction and support' },
    { name: 'Safety First Award', desc: 'Commitment to workplace safety practices' },
    { name: 'Team Player of the Year', desc: 'Exceptional collaboration and team support' },
    { name: 'Productivity Ace Award', desc: 'Consistently high efficiency and output' },
    { name: 'Continuous Improvement Award', desc: 'Dedication to personal and process improvement' },
    { name: 'Rookie of the Year', desc: 'Outstanding performance by a new employee' }
  ];

  employees.forEach((employee) => {
    // 只有 5% 的員工有得獎記錄
    if (faker.number.int(100) < 5) {
      const hireDate = new Date(employee.hireDate);
      const yearsEmployed = today.getFullYear() - hireDate.getFullYear() + 1;
      
      // 為每年工作生成可能的獎項
      const usedAwards = new Set();
      const availableAwards = [...awards];
      for (let year = 0; year < yearsEmployed; year++) {
        // 每年 20% 的機會獲獎
        if (faker.number.int(100) < 20 && availableAwards.length > 0) {
          const awardIndex = faker.number.int({ min: 0, max: availableAwards.length - 1 });
          const award = availableAwards.splice(awardIndex, 1)[0];
          
          usedAwards.add(award.name);

          const awardYear = hireDate.getFullYear() + year;
          const awardDate = faker.date.between({ 
            from: new Date(awardYear, 0, 1), 
            to: new Date(awardYear, 11, 31) 
          });

          // 確保獎項日期不早於入職日期且不晚於今天
          if (awardDate >= hireDate && awardDate <= today) {
            awardRecords.push({
              employeeId: employee.employeeId,
              awardName: award.name,
              awardDesc: award.desc,
              awardDate: awardDate.toISOString().split('T')[0]
            });
          }
        }
      }
    }
    if (Date.now() - startTime > timeout) {
      return awardRecords; // 提前返回已生成的記錄
    }
  });

  return awardRecords;
};

module.exports = { generateAwardRecords };