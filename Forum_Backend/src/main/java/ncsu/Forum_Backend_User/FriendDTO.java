package ncsu.Forum_Backend_User;

import java.util.HashSet;
import java.util.Set;

public class FriendDTO {
	private Long id;
	private Set<User> friends = new HashSet<>();
	private Set<User> requestSent = new HashSet<>();
	private Set<User> requestsRecieved = new HashSet<>();
	public FriendDTO(User user) {
		this.id = user.getId();
		this.friends = user.getFriends();
		this.requestSent = user.getRequestsSent();
		this.requestsRecieved = user.getRequestsReceived();
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Set<User> getFriends() {
		return friends;
	}
	public void setFriends(Set<User> friends) {
		this.friends = friends;
	}
	public Set<User> getRequestSent() {
		return requestSent;
	}
	public void setRequestSent(Set<User> requestSent) {
		this.requestSent = requestSent;
	}
	public Set<User> getRequestsRecieved() {
		return requestsRecieved;
	}
	public void setRequestsRecieved(Set<User> requestsRecieved) {
		this.requestsRecieved = requestsRecieved;
	}
	
 }
