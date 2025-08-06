package ncsu.Forum_Backend_Message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ncsu.Forum_Backend_User.User;
import ncsu.Forum_Backend_User.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groupchat")
@CrossOrigin(origins = "http://localhost:5173")
public class GroupMessageController {

    @Autowired
    private GroupMessageRepository groupMessageRepo;

    @Autowired
    private DirectMessageRepository groupChatRepo;

    @Autowired
    private UserRepository userRepo;

    // Get messages in a group chat
    @GetMapping("/{groupId}")
    public ResponseEntity<List<GroupMessageDTO>> getGroupMessages(@PathVariable Long groupId) {
        List<GroupMessage> entities = groupMessageRepo.findByGroupIdOrderByTimestampAsc(groupId);
        List<GroupMessageDTO> dtos = entities.stream()
            .map(GroupMessageDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

     //Send a message to group chat
    @PostMapping("/send/{groupId}/{userId}")
    public GroupMessage sendGroupMessage(
            @PathVariable Long groupId,
            @PathVariable Long userId,
            @RequestBody String content) {

        User sender = userRepo.findById(userId).orElseThrow();
        GroupMessage message = new GroupMessage();
        GroupChat group = groupChatRepo.findById(groupId).orElseThrow();
        message.setSender(sender);
        message.setGroup(group);
        message.setContent(content);
        GroupMessage update = groupMessageRepo.save(message);
        group.setLastMessage(message);
        groupChatRepo.save(group);
        return update;

    }

    public record GroupMessageRequest(Long senderId, String content) {}
    public class GroupMessageDTO {
        private Long id;
        private GroupChat group;
        private User sender;
        private String content;
        private LocalDateTime timestamp;

        // constructor to map from your entity
        public GroupMessageDTO(GroupMessage gm) {
            this.id                  = gm.getId();
            this.group             = gm.getGroup();
            this.sender = gm.getSender();
            this.content             = gm.getContent();
            this.timestamp           = gm.getTimestamp();
        }

        // getters (no setters needed if you only read)
        public Long getId()                      { return id; }
        public GroupChat getGroup()                 { return group; }
        public User getSender() {return sender;}
        public String getContent()               { return content; }
        public LocalDateTime getTimestamp()      { return timestamp; }
    }
}
