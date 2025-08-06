package ncsu.Forum_Backend_Message;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    // 2.1 All messages in a department (any type)
    List<Message> findByDepartmentIdOrderByTimestampDesc(Long departmentId);

    // 2.2 All “general” department posts (no class, no professor)
    List<Message> findByDepartmentIdAndProfessorIsNullAndClazzIsNullOrderByTimestampDesc(Long departmentId);

    // 2.3 All class‑specific posts in a department
    List<Message> findByDepartmentIdAndClazzIdOrderByTimestampDesc(Long departmentId, Long classId);

    // 2.4 All professor‑specific posts in a department
    List<Message> findByDepartmentIdAndProfessorIdOrderByTimestampDesc(Long departmentId, Long professorId);

    // 2.5 Posts for a given professor + class (e.g. CSC 116 with Dr. Nguyen)
    List<Message> findByDepartmentIdAndClazzIdAndProfessorIdOrderByTimestampDesc(
        Long departmentId, Long classId, Long professorId
    );

    // 2.6 If you want to filter by “type” enum as well:
    List<Message> findByDepartmentIdAndTypeOrderByTimestampDesc(Long departmentId, Message.MessageType type);

    // …and any combination you like (e.g. findBySenderId, pagination, etc.)…
    List<Message> findByParentMessageIdOrderByTimestampDesc(Long id);

	List<Message> findAllByOrderByTimestampDesc();
}
