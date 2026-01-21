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

      for (let assignment of assignmentGroup.assignemts) {
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
