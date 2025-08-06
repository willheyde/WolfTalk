package ncsu.Forum_Backend_Message;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ncsu.Forum_Backend_User.User;
import ncsu.Forum_Backend_User.UserRepository;
import ncsu.Forum_Backend_Professor.Professor;
import ncsu.Forum_Backend_Professor.ProfessorRepository;
import ncsu.Forum_Backend_Classes.Classes;
import ncsu.Forum_Backend_Classes.ClassesRepository;
import ncsu.Forum_Backend_Department.Department;
import ncsu.Forum_Backend_Department.DepartmentRepository;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    @Autowired private MessageRepository messageRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private DepartmentRepository departmentRepository;
    @Autowired private ProfessorRepository professorRepository;
    @Autowired private ClassesRepository classRepository;

    // GET all messages
    @GetMapping
    public List<Message> getAllMessages() {
        return messageRepository.findAllByOrderByTimestampDesc();
    }
    @PostMapping("/{id}/like")
    public ResponseEntity<?> likedMessage(
        @PathVariable long id,
        @RequestBody VoteRequest req
    ) {
        try {
            Message msg = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

            if (req.getUnityId() == null || req.getUnityId().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Missing unityId in request");
            }

            msg.addLiked(req.getUnityId());
            Message updated = messageRepository.save(msg);
            return ResponseEntity.ok(updated);

        } catch (Exception e) {
        	 e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error while liking post: " + e.getMessage());
        }
    }
    @PutMapping("/{id}/remove/like")
    public ResponseEntity<?> removeLiked(@PathVariable Long id, @RequestBody VoteRequest unityId) {
    	Message msg = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

            if (unityId.getUnityId() == null || unityId.getUnityId().isEmpty()) {
            	return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Missing unityId in request");
            }
            msg.removeLiked(unityId.getUnityId());
            Message updated = messageRepository.save(msg);
            return ResponseEntity.ok(updated);
    }
    @PutMapping("/{id}/remove/dislike")
    public ResponseEntity<?> removeDisliked(@PathVariable Long id, @RequestBody VoteRequest unityId) {
    	Message msg = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

            if (unityId.getUnityId() == null || unityId.getUnityId().isEmpty()) {
            	return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Missing unityId in request");
            }
            msg.removeDisliked(unityId.getUnityId());
            Message updated = messageRepository.save(msg);
            return ResponseEntity.ok(updated);
    }
    @PostMapping("/{id}/dislike")
    public ResponseEntity<?> dislikedMessage(
        @PathVariable long id,
        @RequestBody VoteRequest req
    ) {
    	try {
            Message msg = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

            if (req.getUnityId() == null || req.getUnityId().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Missing unityId in request");
            }

            msg.addDislike(req.getUnityId());
            Message updated = messageRepository.save(msg);
            return ResponseEntity.ok(updated);

        } catch (Exception e) {
        	 e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error while liking post: " + e.getMessage());
        }
    }
    // POST message
    @PostMapping
    public Message postMessage(@RequestBody MessageRequest messageRequest) {
        Message newMsg = new Message();
        
        // Set basic message properties
        newMsg.setBody(messageRequest.getContent());
        newMsg.setTitle(messageRequest.getTitle());
        newMsg.setTimestamp(LocalDateTime.now());
        
        // Set sender
        User sender = userRepository.findByUnityId(messageRequest.getSenderId());
        	newMsg.setSender(sender);
        
        
        
        // Optional: Set professor
        if (messageRequest.getProfessorId() != null) {
            Professor professor = professorRepository.findById(messageRequest.getProfessorId())
                .orElseThrow(() -> new RuntimeException("Professor not found"));
            newMsg.setProfessor(professor);
            
        }
        
        // Optional: Set class
        if (messageRequest.getClassId() != null) {
            Classes clazz = classRepository.findById(messageRequest.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));
            newMsg.setClazz(clazz);
        }
        
        // Optional: Set parent message for replies
        if (messageRequest.getParentId() != null) {
            Message parent = messageRepository.findById(messageRequest.getParentId())
                .orElseThrow(() -> new RuntimeException("Parent message not found"));
            newMsg.setParentMessage(parent);
            newMsg.setDepartment(parent.getDepartment());

        }
        else {
        	Department department = departmentRepository.findById(messageRequest.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
                newMsg.setDepartment(department);
        }
        
        // Determine message type
        if (messageRequest.getProfessorId() == null && messageRequest.getClassId() == null) {
            newMsg.setType(Message.MessageType.GENERAL);
        } else if (messageRequest.getProfessorId() != null && messageRequest.getClassId() == null) {
            newMsg.setType(Message.MessageType.PROFESSOR);
        } else {
            newMsg.setType(Message.MessageType.CLASS);
        }
        
        return messageRepository.save(newMsg);
    }
    // DELETE message by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        if (!messageRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        messageRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // GET post details by ID
    @GetMapping("/{postId}")
    public ResponseEntity<Message> getPostDetails(@PathVariable Long postId) {
        return messageRepository.findById(postId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{postId}")
    public ResponseEntity<Message> updatePost(
            @PathVariable("postId") long postId,
            @RequestBody updatedMessage newMessageData
    ) {
        return messageRepository.findById(postId)
            .map(existing -> {
                existing.setTitle(newMessageData.getTitle());
                existing.setBody(newMessageData.getBody());

                if (newMessageData.getProf() != null) {
                    Professor prof = professorRepository.findById(newMessageData.getProf())
                            .orElse(null);
                    existing.setProfessor(prof);
                }

                if (newMessageData.getClazz() != null) {
                    Classes clazz = classRepository.findById(newMessageData.getClazz())
                            .orElse(null);
                    existing.setClazz(clazz);
                }

                Message saved = messageRepository.save(existing);
                return ResponseEntity.ok(saved);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Static inner class for the message request DTO
    public static class MessageRequest {
        private String content;
        private String title;
        private String senderId;
        private Long departmentId;
        private Long professorId;
        private Long classId;
        private Long parentId;
        
        // Getters and setters
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getSenderId() { return senderId; }
        public void setSenderId(String senderId) { this.senderId = senderId; }
        
        public Long getDepartmentId() { return departmentId; }
        public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
        
        public Long getProfessorId() { return professorId; }
        public void setProfessorId(Long professorId) { this.professorId = professorId; }
        
        public Long getClassId() { return classId; }
        public void setClassId(Long classId) { this.classId = classId; }
        
        public Long getParentId() { return parentId; }
        public void setParentId(Long parentId) { this.parentId = parentId; }
    }

    public static class updatedMessage{
    	private String body;
    	private Long clazz;
    	private Long prof;
    	private String title;
		public String getBody() {
			return body;
		}
		public void setBody(String body) {
			this.body = body;
		}
		public Long getClazz() {
			return clazz;
		}
		public void setClazz(Long clazz) {
			this.clazz = clazz;
		}
		public Long getProf() {
			return prof;
		}
		public void setProf(Long prof) {
			this.prof = prof;
		}
		
		public String getTitle() {
			return title;
		}
		public void setTitle(String title) {
			this.title = title;
		}
    	
    }
    public static class VoteRequest {
        private String unityId;
        public VoteRequest() {}              // Jackson needs no-args ctor

        public String getUnityId() { return unityId; }
        public void setUnityId(String unityId) {
          this.unityId = unityId;
        }
      }
}