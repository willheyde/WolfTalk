package ncsu.Forum_Backend_Message;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import ncsu.Forum_Backend_Classes.Classes;
import ncsu.Forum_Backend_Department.Department;
import ncsu.Forum_Backend_User.User;


@Entity
public class GroupMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JsonBackReference
    private GroupChat group;
    @ManyToOne
    private User sender;
    @Column(nullable = false, length = 1000)
    private String content;

    private LocalDateTime timestamp;
    
    public GroupMessage() {
        this.timestamp = LocalDateTime.now();
    }

	public GroupMessage(Long id, User sender, GroupChat group, String content, LocalDateTime timestamp) {
		super();
		this.id = id;
		this.sender = sender;
		this.group = group;
		this.content = content;
		this.timestamp = timestamp;
	}
	public GroupMessage( User sender, GroupChat group, String content, LocalDateTime timestamp) {
		
		this.sender = sender;
		this.group = group;
		this.content = content;
		this.timestamp = timestamp;
	}

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

	public GroupChat getGroup() {
		return group;
	}

	public void setGroup(GroupChat group) {
		this.group = group;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}

}
