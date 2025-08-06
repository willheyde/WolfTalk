package ncsu.Forum_Backend_Classes;

import org.springframework.data.jpa.repository.JpaRepository;

import ncsu.Forum_Backend_Professor.Professor;

import java.util.List;
import java.util.Optional;

public interface ClassesRepository extends JpaRepository<Classes, Long> {
    Optional<Classes> findByCourseTitle(String courseTitle);
	List<Classes> findByCourseTitleContainingIgnoreCase(String q);
}