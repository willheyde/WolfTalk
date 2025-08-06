package ncsu.Forum_Backend_Message;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OneToMany;
import ncsu.Forum_Backend_User.User;
@Entity
public class GroupChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    private Set<User> participants;
    @OneToOne               
    @JsonManagedReference
    private GroupMessage lastMessage;
    private String groupTitle;
   



	public Set<User> getParticipants() {
		if(participants == null) {
			participants = new HashSet<User>();
		}
		return participants;
	}

	public void setParticipants(Set<User> participants) {
		this.participants = participants;
	}


	public GroupMessage getLastMessage() {
		return lastMessage;
	}

	public void setLastMessage(GroupMessage lastMessage) {
		this.lastMessage = lastMessage;
	}

	public String getGroupTitle() {
		return groupTitle;
	}

	public void setGroupTitle(String groupTitle) {
		this.groupTitle = groupTitle;
	}


	public GroupChat(Long id, Set<User> participants, LocalDateTime lastUpdated, GroupMessage lastMessage,
			String groupTitle) {
		super();
		this.id = id;
		this.participants = participants;
		this.lastMessage = lastMessage;
		this.groupTitle = groupTitle;
	}
	public GroupChat() {
		this.id = null;
		this.participants = null;
		this.lastMessage = null;
		this.groupTitle = null;
	}
	
	
	

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}






}
