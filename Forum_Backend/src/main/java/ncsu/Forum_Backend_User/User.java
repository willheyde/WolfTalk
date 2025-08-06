package ncsu.Forum_Backend_User;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import ncsu.Forum_Backend_Classes.Classes;
import ncsu.Forum_Backend_Department.Department;
import ncsu.Forum_Backend_Message.Message;

@Entity
@Table(name = "app_user")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean isStudent;
    private String unityId;
    private String displayName;
    private String email;
    private String bio;
    private String department;
    private String profilePictureUrl;

    @ManyToMany(mappedBy = "users")
    @JsonBackReference("dept-users")
    private Set<Department> departments = new HashSet<>();

    @OneToMany
    @JsonIgnoreProperties("sender_id")
    private List<Message> messages = new ArrayList<>();

    @ManyToMany
    @JoinTable(
      name = "friend_requests_sent",
      joinColumns = @JoinColumn(name="sender_id"),
      inverseJoinColumns = @JoinColumn(name="receiver_id")
    )
    @JsonIgnore
    private Set<User> requestsSent = new HashSet<>();

    @ManyToMany(mappedBy = "requestsSent")
    @JsonIgnore
    private Set<User> requestsReceived = new HashSet<>();

    @ManyToMany
    @JoinTable(
      name = "user_friends",
      joinColumns = @JoinColumn(name="user_id"),
      inverseJoinColumns = @JoinColumn(name="friend_id")
    )
    @JsonIgnore
    private Set<User> friends = new HashSet<>();

    public User(Long id, String unityId, String displayName, String email, String bio, String profilePictureUrl, boolean isStudent, String department) {
        setId(id);
        setUnityId(unityId);
        setDisplayName(displayName);
        setEmail(email);
        setBio(bio);
        setProfilePictureUrl(profilePictureUrl);
        setStudent(isStudent);
        setDepartment(department);
    }

    public User(String unityId, String displayName, String email, String bio, String profilePictureUrl, boolean isStudent) {
        setUnityId(unityId);
        setDisplayName(displayName);
        setEmail(email);
        setBio(bio);
        setProfilePictureUrl(profilePictureUrl);
        setStudent(isStudent);
    }

    public User() {
        this.unityId = null;
        this.displayName = null;
        this.bio = null;
        this.email = null;
        this.profilePictureUrl = null;
        this.isStudent = false;
        this.id = null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUnityId() {
        return unityId;
    }

    public void setUnityId(String unityId) {
        this.unityId = unityId;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public boolean isStudent() {
        return isStudent;
    }

    public void setStudent(boolean isStudent) {
        this.isStudent = isStudent;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = (profilePictureUrl == null || profilePictureUrl.isEmpty()) ? null : profilePictureUrl;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Set<Department> getDepartments() {
        return departments;
    }

    public void setDepartments(Set<Department> departments) {
        this.departments = departments;
    }

    public void addDepartment(Department department) {
        if (departments.contains(department)) {
            throw new IllegalArgumentException("Can't add duplicate department");
        }
        departments.add(department);
    }

    public void removeDepartment(Department department) {
        departments.remove(department);
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    public Set<User> getRequestsSent() {
        return requestsSent;
    }

    public void setRequestsSent(Set<User> requestsSent) {
        this.requestsSent = requestsSent;
    }

    public Set<User> getRequestsReceived() {
        return requestsReceived;
    }

    public void setRequestsReceived(Set<User> requestsReceived) {
        this.requestsReceived = requestsReceived;
    }

    public Set<User> getFriends() {
        return friends;
    }

    public void setFriends(Set<User> friends) {
        this.friends = friends;
    }

    public void addFriend(User other) {
        this.friends.add(other);
        other.friends.add(this);
    }

    public void removeFriend(User other) {
        this.friends.remove(other);
        other.friends.remove(this);
    }
}
