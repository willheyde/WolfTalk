package ncsu.Forum_Backend_Message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import ncsu.Forum_Backend_User.User;
import ncsu.Forum_Backend_User.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.HashSet;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class DirectMessageController {

    @Autowired
    private DirectMessageRepository messageRepo;
    @Autowired
    private GroupMessageRepository groupMessageRepo;
    @Autowired
    private UserRepository userRepo;

//    @GetMapping("{User}")
//    public List<GroupChat> getGroupChatForUser(@PathVariable User user) {
//        if(user == null) {
//            throw new IllegalArgumentException("Null User");
//        }
//        return messageRepo.findDistinctByParticipantsContainingOrderByLastMessage_TimestampDesc(user);
//    }

    @PostMapping("/create/{userId}")
    public ResponseEntity<?> addGroupChat(@RequestBody GroupChatRequest groupChatRequest, @PathVariable Long userId) {
        Optional<User> userOpt = userRepo.findById(userId);
        if(userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
        }

        User user = userOpt.get();

        GroupChat newGroup = new GroupChat();
        newGroup.setGroupTitle(groupChatRequest.getGroupTitle());

        Set<User> participants = new HashSet<>();
        if (groupChatRequest.getParticipantIds() != null) {
            for (Long id : groupChatRequest.getParticipantIds()) {
                userRepo.findById(id).ifPresent(participants::add);
            }
        }
        participants.add(user); // Include creator by default

        newGroup.setParticipants(participants);
        GroupChat updatedGroup = messageRepo.save(newGroup);

        GroupMessage newMessage = new GroupMessage();
        newMessage.setContent(groupChatRequest.getContent());
        newMessage.setGroup(updatedGroup);
        newMessage.setSender(user);
        newMessage.setTimestamp(LocalDateTime.now());

        GroupMessage updatedMessage = groupMessageRepo.save(newMessage);
        updatedGroup.setLastMessage(updatedMessage);
        messageRepo.save(updatedGroup);

        return ResponseEntity.ok(updatedGroup);
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> addParticipant(@PathVariable Long userId, @RequestBody Long groupId) {
        try {
            User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            GroupChat groupChat = messageRepo.findById(groupId).orElseThrow(() -> new RuntimeException("Group not found"));
            groupChat.getParticipants().add(user);
            return ResponseEntity.ok(groupChat);
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error while adding participant: " + e.getMessage());
        }
    }
    @GetMapping("/direct-message/{userId}")
    public ResponseEntity<List<GroupChat>> getRecentConversations(@PathVariable Long userId) {
        List<GroupChat> convos = messageRepo
            .findByParticipants_IdOrderByLastMessage_TimestampDesc(userId);
        return ResponseEntity.ok(convos);
    }


    public static class GroupChatRequest {
        private Set<Long> participantIds;
        private String groupTitle;
        private String content;

        public GroupChatRequest() {}

        public Set<Long> getParticipantIds() {
            return participantIds;
        }
        public void setParticipantIds(Set<Long> participantIds) {
            this.participantIds = participantIds;
        }

        public String getGroupTitle() {
            return groupTitle;
        }
        public void setGroupTitle(String groupTitle) {
            this.groupTitle = groupTitle;
        }

        public String getContent() {
            return content;
        }
        public void setContent(String content) {
            this.content = content;
        }
    }
}
