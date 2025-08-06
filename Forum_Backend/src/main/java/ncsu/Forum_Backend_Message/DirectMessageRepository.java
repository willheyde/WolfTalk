package ncsu.Forum_Backend_Message;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ncsu.Forum_Backend_User.User;

import java.util.List;

public interface DirectMessageRepository extends JpaRepository<GroupChat, Long> {

    List<GroupChat> findByGroupTitle(String groupTitle);

    List<GroupChat> findByParticipants_IdOrderByLastMessage_TimestampDesc(Long userId);

}

