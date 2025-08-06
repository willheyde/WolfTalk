package ncsu.Forum_Backend_Department;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import ncsu.Forum_Backend_Message.Message;

public interface DepartmentRepository extends JpaRepository<Department, Long> {	
	
	@EntityGraph(attributePaths = {"classes","professors","messages"})
	  Optional<Department> findAllRelationsById(Long id);
	Optional<Department> findByName(String name);
}


