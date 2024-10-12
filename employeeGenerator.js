const { faker } = require('@faker-js/faker');

// 生成 6 位數的員工 ID，從 001000 開始
let currentEmployeeId = 1000;
const generateEmployeeId = () => {
  currentEmployeeId++;
  return currentEmployeeId.toString().padStart(6, '0');
};

// 生成日期
const generateDate = (start, end) => {
  return faker.date.between({ from: start, to: end });
};

// 生成指定數量的假員工數據
const generateEmployees = (count) => {
  const employees = [];

  for (let i = 0; i < count; i++) {
    const dateOfBirth = generateDate(new Date('1950-01-01'), new Date('1999-12-31'));
    
    // 確保入職日期在出生日期之後至少 22 年
    const minHireDate = new Date(dateOfBirth);
    minHireDate.setFullYear(minHireDate.getFullYear() + 22);
    const hireDate = generateDate(minHireDate, new Date());
    
    const employee = {
      employeeId: null, // 暂时设为 null，稍后会根据 hireDate 排序后设置
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      dateOfBirth: dateOfBirth.toISOString().split('T')[0],
      hireDate: hireDate.toISOString().split('T')[0],
      status: 'Active',
      terminationDate: null,
      terminationReason: null
    };

    employees.push(employee);
  }

  // 根据 hireDate 排序员工
  employees.sort((a, b) => new Date(a.hireDate) - new Date(b.hireDate));

  // 分配 employeeId
  employees.forEach(employee => {
    employee.employeeId = generateEmployeeId();
  });

  return employees;
};

// 添加一个新函数来处理 3% 的随机离职
const processRandomTerminations = (employees) => {
  const currentDate = new Date();
  employees.forEach(employee => {
    if (employee.status === 'Active' && faker.number.int(100) < 3) {
      const minTerminationDate = new Date(employee.hireDate);
      minTerminationDate.setFullYear(minTerminationDate.getFullYear() + 1);
      if (minTerminationDate <= currentDate) {
        employee.status = 'Terminated';
        employee.terminationDate = generateDate(minTerminationDate, currentDate).toISOString().split('T')[0];
        employee.terminationReason = 'Random Termination';
      }
    }
  });
};

module.exports = { generateEmployees, processRandomTerminations };