// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500
    }
  ]
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  }
];

function getLearnerData(courseInfo, assignmentGroup, learnerSubmission) {
  try {
    if (courseInfo.id !== assignmentGroup.course_id) {
      throw new Error("Assignment group does not belong to the course");
    }
    const results = [];
    const today = new Date();

    for (let i = 0; i < learnerSubmission.length; i++) {
      const submission = learnerSubmission[i];
      let learner = results.find((l) => l.id === submission.learner_id);
      if (!learner) {
        learner = { id: submission.learner_id, avg: 0 };
        results.push(learner);
      }
    }
    for (let learner of results) {
      let totalScore = 0;
      let totalPoints = 0;

      for (let assignment of assignmentGroup.assignments) {
        const dueDate = new Date(assignment.due_at);

        if (dueDate > today) continue;
        if (assignment.points_possible === 0) continue;

        let submission = learnerSubmission.find(
          (s) =>
            s.assignment_id === assignment.id && s.learner_id === learner.id,
        );
        if (!submission) continue;
        let score = submission.submission.score;

        const submissionDate = new Date(submission.submission.submitted_at);
        if (submissionDate > dueDate) {
          score -= assignment.points_possible * 0.1;
        }
        if (score < 0) score = 0;
        const percent = score / assignment.points_possible;

        learner[assignment.id] = percent;
        totalScore += score;
        totalPoints += assignment.points_possible;
      }
      if (totalPoints > 0) {
        learner.avg = totalScore / totalPoints;
      }
    }
    return results;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}
const result = getLearnerData(
  CourseInfo,
  AssignmentGroup,
  LearnerSubmissions);
  console.log(result);


