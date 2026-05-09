import { CourseCard } from './CourseCard.js';

/**
 * Liste publique des formations de l’académie.
 */
export function CourseList(courses, options = {}) {
  return `
    <div class="academy-course-grid academy-course-grid--list">
      ${courses.map((course) => CourseCard(course, options)).join('')}
    </div>
  `;
}
