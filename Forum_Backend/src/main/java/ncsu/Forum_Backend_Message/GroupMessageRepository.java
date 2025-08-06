package ncsu.Forum_Backend_Message;


import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface GroupMessageRepository extends JpaRepository<GroupMessage, Long> {
	List<GroupMessage> findByGroupIdOrderByTimestampAsc(Long groupId);}
