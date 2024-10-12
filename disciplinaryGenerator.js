const { faker } = require('@faker-js/faker');

const incidentTypes = ['Verbal Warning', 'Written Warning', 'Suspension', 'Termination'];

const incidentDescriptions = [
  "Unauthorized access to company confidential files.",
  "Multiple instances of tardiness without a valid explanation.",
  "Use of inappropriate or offensive language in the workplace.",
  "Failure to complete assigned projects on time, resulting in customer complaints.",
  "Violation of the company's information security policy by transmitting sensitive data over an insecure network.",
  "Excessive use of social media during work hours, affecting work efficiency.",
  "Unauthorized use of company resources for personal purposes.",
  "Physical altercations or conflicts in the workplace.",
  "Consumption of alcohol or use of prohibited substances in the workplace or during work hours.",
  "Falsification of work records or expense reports.",
  "Failure to comply with the company's dress code or hygiene standards.",
  "Unauthorized disclosure of customer or employee personal information.",
  "Unprofessional or unethical behavior in the workplace.",
  "Repeated disregard for supervisors' reasonable instructions or requests.",
  "Engagement in illegal or unethical activities in the workplace.",
  "Failure to promptly report significant issues or errors in the workplace.",
  "Abuse of the company's sick leave policy.",
  "Spreading false information or rumors in the workplace.",
  "Failure to comply with the company's health and safety regulations.",
  "Display of discriminatory or harassing behavior in the workplace."
];

function getDisciplinaryAction(incidentType) {
  switch (incidentType) {
    case 'Verbal Warning':
      return [
        'Have a verbal discussion with the employee, issuing a verbal warning and documenting it.',
        'Schedule a follow-up meeting to review the employee\'s progress.',
        'Provide additional training or coaching to address the issue.'
      ];
    case 'Written Warning':
      return [
        'Issue a written warning to the employee, requiring a signature for confirmation.',
        'Implement a performance improvement plan with specific goals and deadlines.',
        'Schedule regular check-ins to monitor progress and provide feedback.'
      ];
    case 'Suspension':
      return [
        'Suspend the employee for 3-5 working days without pay.',
        'Require the employee to attend a counseling session or training program.',
        'Conduct a thorough investigation into the incident and take appropriate action.'
      ];
    case 'Termination':
      return [
        'Terminate the employee contract, effective immediately.',
        'Provide outplacement services or career counseling.',
        'Conduct an exit interview to gather feedback and improve processes.'
      ];
  }
}

function generateDisciplinaryRecord(employee, year) {
  let incidentType;
  const randomNumber = faker.number.int({ min: 1, max: 100 });
  
  if (randomNumber <= 60) {
    incidentType = 'Verbal Warning';
  } else if (randomNumber <= 85) {
    incidentType = 'Written Warning';
  } else if (randomNumber <= 95) {
    incidentType = 'Suspension';
  } else {
    incidentType = 'Termination';
  }
  
  // 确定事件日期的范围
  const yearStart = new Date(`${year}-01-01`);
  const yearEnd = new Date(`${year}-12-31`);
  const endDate = employee.terminationDate ? new Date(employee.terminationDate) : yearEnd;
  const latestDate = new Date(Math.min(yearEnd.getTime(), endDate.getTime()));

  const incidentDate = faker.date.between({ from: yearStart, to: latestDate });
  const actionDate = new Date(Math.min(
    incidentDate.getTime() + faker.number.int({ min: 1, max: 14 }) * 24 * 60 * 60 * 1000,
    latestDate.getTime()
  ));

  const record = {
    employee_id: employee.employeeId,
    incident_date: incidentDate.toISOString().split('T')[0],
    incident_type: incidentType,
    incident_description: faker.helpers.arrayElement(incidentDescriptions),
    disciplinary_action_taken: faker.helpers.arrayElement(getDisciplinaryAction(incidentType)),
    disciplinary_action_date: actionDate.toISOString().split('T')[0]
  };

  if (incidentType === 'Termination') {
    record.isTermination = true;
  }

  return record;
}

function generateDisciplinaryRecords(employees) {
  let allDisciplinaryRecords = [];
  const currentYear = new Date().getFullYear();

  for (const employee of employees) {
    const employeeStartYear = new Date(employee.hireDate).getFullYear();
    const employeeEndYear = employee.terminationDate 
      ? new Date(employee.terminationDate).getFullYear() 
      : currentYear;

    // 对每年都有 5% 的概率生成违规记录
    for (let year = employeeStartYear; year <= employeeEndYear; year++) {
      if (faker.number.int({ min: 1, max: 100 }) <= 5) {
        const record = generateDisciplinaryRecord(employee, year);
        allDisciplinaryRecords.push(record);
        
        // 如果是 Termination，更新员工的 terminationDate
        if (record.isTermination && employee.status === 'Active') {
          employee.terminationDate = record.disciplinary_action_date;
          employee.status = 'Terminated';
          employee.terminationReason = 'Disciplinary Termination';
          break; // 终止后不再生成更多记录
        }
      }
    }
  }

  return allDisciplinaryRecords;
}

module.exports = { generateDisciplinaryRecords };