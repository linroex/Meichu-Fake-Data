const { faker } = require('@faker-js/faker');

const skills = [
  // 软件开发
  'JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go', 'React', 'Angular', 'Vue.js', 'Node.js',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'CI/CD',
  // 项目管理
  'Agile Methodologies', 'Scrum', 'Kanban', 'JIRA', 'Trello', 'MS Project',
  // 设计
  'UI/UX Design', 'Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Sketch',
  // 营销
  'SEO', 'Content Marketing', 'Social Media Marketing', 'Google Analytics'
];

const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

function generateSkillsForEmployee(employeeId) {
  const numberOfSkills = faker.number.int({ min: 1, max: 5 }); // 每个员工1-5个技能
  const employeeSkills = new Set(); // 使用 Set 来避免重复技能

  while (employeeSkills.size < numberOfSkills) {
    const skill = faker.helpers.arrayElement(skills); // 从预定义的技能列表中随机选择
    if (!employeeSkills.has(skill)) {
      employeeSkills.add({
        employee_id: employeeId,
        skill_name: skill,
        skill_level: faker.helpers.arrayElement(skillLevels)
      });
    }
  }

  return Array.from(employeeSkills);
}

function generateSkillsRecords(employees) {
  let allSkills = [];

  for (const employee of employees) {
    const employeeSkills = generateSkillsForEmployee(employee.employeeId);
    allSkills = allSkills.concat(employeeSkills);
  }

  return allSkills;
}

module.exports = { generateSkillsRecords };