package ncsu.Forum_Backend_Message;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import ncsu.Forum_Backend_User.User;
import ncsu.Forum_Backend_Classes.Classes;      // your course entity
import ncsu.Forum_Backend_Professor.Professor; // assume you have a Professor entity (not shown here)
import ncsu.Forum_Backend_Department.Department;

@Entity
@Table(name = "messages")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // who wrote it:
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    // always belongs to exactly one department:
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = true)
    @JsonBackReference("dept-mess")
    private Department department;
    
    // FIXED: Parent message relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @JsonBackReference("parent-comments")  // This prevents infinite loop
    private Message parentMessage;
    
    // FIXED: Comments relationship
    @OneToMany(mappedBy = "parentMessage",
               cascade = CascadeType.ALL,
               orphanRemoval = true)
    @JsonManagedReference("parent-comments")  // This manages the forward reference
    private List<Message> comments = new ArrayList<>();
    
    // optional: which professor this message is "about"
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id", nullable = true)
    @JsonManagedReference("professor-messages")  // Prevents circular reference with Professor
    private Professor professor;

    // optional: which class/course this message is "about"
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = true)
    @JsonManagedReference("class-messages")  // This prevents circular reference with Classes
    private Classes clazz;
    
    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;
    
    @ElementCollection
    @CollectionTable(
      name = "message_likes", 
      joinColumns = @JoinColumn(name = "message_id")
    )
    @Column(name = "unity_id")
    private Set<String> likedBy;
    
    @ElementCollection
    @CollectionTable(
      name = "message_dislikes",
      joinColumns = @JoinColumn(name = "message_id")
    )
    @Column(name = "unity_id")
    private Set<String> dislikedBy;
    
    private LocalDateTime timestamp;
    
    // If you still want an easy discriminator for UI logic
    public enum MessageType {
        GENERAL,    // no professor, no class
        PROFESSOR, // has professor ≠ null, clazz can be null or not
        CLASS,     // has clazz ≠ null, professor can be null or not
        DIRECT       // (if you also handle DMs here; otherwise keep DMs separate)
    }

    @Enumerated(EnumType.STRING)
    private MessageType type;
   

    // Constructors
    public Message(Long id, User sender, Department department, String title, String body, LocalDateTime timestamp,
            MessageType type) {
        super();
        this.id = id;
        this.sender = sender;
        this.department = department;
        this.title = title;
        this.body = body;
        this.timestamp = timestamp;
        this.type = type;
        this.professor = null;
        this.clazz = null;
    }
    
    public Message() {
        super();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public Department getDepartment() {
        return department;
    }
    

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Professor getProfessor() {
        return professor;
    }

    public void setProfessor(Professor professor) {
        this.professor = professor;
    }

    public Classes getClazz() {
        return clazz;
    }

    public void setClazz(Classes clazz) {
        this.clazz = clazz;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }
    
    public void removeComment(Message message) {
        comments.remove(message);
        message.setParentMessage(null);
    }
    
    public void addComment(Message message) {
        message.setParentMessage(this);
        comments.add(message);
    }
    
    public List<Message> getComments() {
        return comments;
    }
    @JsonProperty("parentId")
    public Long getParentId() {
    	return parentMessage == null ? null : parentMessage.getId();
    }
    
    public void setParentMessage(Message parentMessage) {
        this.parentMessage = parentMessage;
    }
    
    public void setComments(List<Message> comments) {
        this.comments = comments;
    }
    
    public int getLikes() {
        int likes = (likedBy == null) ? 0 : likedBy.size();
        int dislikes = (dislikedBy == null) ? 0 : dislikedBy.size();
        return likes - dislikes;
    }
    
    public Set<String> getLikedBy() {
        return likedBy;
    }
    
    public void setLikedBy(Set<String> likedBy) {
        this.likedBy = likedBy;
    }
    
    public void addLiked(String unityId) {
        if (likedBy == null) likedBy = new HashSet<>();
        if (dislikedBy == null) dislikedBy = new HashSet<>();
        dislikedBy.remove(unityId);
        if(!likedBy.contains(unityId)) {
            likedBy.add(unityId);
        }
    }
    
    public void removeLiked(String unityId) {
        likedBy.remove(unityId);
    }
    public void removeDisliked(String unityId) {
        dislikedBy.remove(unityId);
    }
    
    public void addDislike(String unityId) {
        if (likedBy == null) likedBy = new HashSet<>();
        if (dislikedBy == null) dislikedBy = new HashSet<>();
        likedBy.remove(unityId);
        if(!dislikedBy.contains(unityId)) {
            dislikedBy.add(unityId);
        }
    }
    public Set<String> getDislikedBy() {
        if (dislikedBy == null) {
            return null;
        }
        return dislikedBy;
    }

    // (optional) if you want Jackson to bind it on updates
    public void setDislikedBy(Set<String> dislikedBy) {
        this.dislikedBy = dislikedBy;
    }
    
    
}