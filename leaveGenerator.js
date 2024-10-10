const { faker } = require('@faker-js/faker');

const generateLeaveRecords = (employees) => {
  const leaveRecords = [];
  const today = new Date();

  employees.forEach(employee => {
    const hireDate = new Date(employee.hireDate);
    let currentYear = hireDate.getFullYear();
    const yearsEmployed = today.getFullYear() - currentYear + 1;

    for (let year = 0; year < yearsEmployed; year++) {
      // 90% 的员工每年请 2-10 次假，10% 的员工每年请 0-2 次假
      const isFrequentLeaver = faker.number.int({ min: 1, max: 100 }) <= 90;
      const numberOfLeaves = isFrequentLeaver
        ? faker.number.int({ min: 2, max: 10 })
        : faker.number.int({ min: 0, max: 2 });

      for (let i = 0; i < numberOfLeaves; i++) {
        const yearStart = new Date(currentYear, 0, 1);
        const yearEnd = new Date(currentYear, 11, 31);
        const leaveStart = faker.date.between({ from: yearStart, to: yearEnd });
        
        // 确保请假结束日期不超过年底
        const maxEndDate = new Date(Math.min(yearEnd.getTime(), leaveStart.getTime() + 14 * 24 * 60 * 60 * 1000));
        const leaveEnd = faker.date.between({ from: leaveStart, to: maxEndDate });

        // 申请日期在开始日期前 30 天内，但不早于入职日期
        const earliestApplyDate = new Date(Math.max(hireDate.getTime(), leaveStart.getTime() - 30 * 24 * 60 * 60 * 1000));
        
        let applyDate;
        if (earliestApplyDate < leaveStart) {
          applyDate = faker.date.between({ from: earliestApplyDate, to: leaveStart });
        } else {
          applyDate = leaveStart;
        }

        // 确保请假日期不能晚于离职日期
        if (employee.terminationDate && new Date(employee.terminationDate) < leaveStart) {
          continue; // 如果请假开始日期晚于离职日期，则跳过这次请假
        }

        const leaveType = faker.helpers.arrayElement(['sick', 'vacation', 'Maternity', 'unpaid']);
        const approvalStatus = faker.number.int({ min: 1, max: 100 }) <= 90 ? 'approved' : faker.helpers.arrayElement(['pending', 'rejected']);

        leaveRecords.push({
          employeeId: employee.employeeId,
          startDate: leaveStart.toISOString().split('T')[0],
          endDate: leaveEnd.toISOString().split('T')[0],
          applyDate: applyDate.toISOString().split('T')[0],
          leaveType: leaveType,
          approvalStatus: approvalStatus
        });
      }

      currentYear++;
    }
  });

  return leaveRecords;
};

module.exports = { generateLeaveRecords };