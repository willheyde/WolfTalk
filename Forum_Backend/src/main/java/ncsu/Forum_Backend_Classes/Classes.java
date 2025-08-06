package ncsu.Forum_Backend_Classes;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import ncsu.Forum_Backend_Department.Department;
import ncsu.Forum_Backend_Message.Message;
import ncsu.Forum_Backend_Professor.Professor;
import ncsu.Forum_Backend_User.User;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Classes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String courseTitle; // e.g., CSC116

    // Chat messages in this class
    @OneToMany(mappedBy = "clazz", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("class-messages")
    private List<Message> messages = new ArrayList<>();
    @ManyToOne
    @JoinColumn(name = "department_id")
    @JsonBackReference("dept-class")
    private Department department;
    @ManyToMany
    @JoinTable(
        name = "class_professor",
        joinColumns = @JoinColumn(name = "class_id"),
        inverseJoinColumns = @JoinColumn(name = "professor_id")
    )
    @JsonManagedReference("class-prof")
    private List<Professor> professors = new ArrayList<>();
   
    public List<Professor> getProfessors() {
		return professors;
	}
	public void setProfessors(List<Professor> professors) {
		this.professors = professors;
	}
	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}
	private boolean chatEnabled = true;
	public Classes(Long id, String courseCode, ArrayList<Message> messages, Set<User> participants, Department major) {
		setId(id);
		setCourseTitle(courseCode);
		setMessages(messages);
		setDepartment(major);
	}
	public Classes(String courseCode, ArrayList<Message> messages, Set<User> participants, Department major) {
		this(null, courseCode, messages, participants, major);
	}
	public void addProfessor(Professor professor) {
		professors.add(professor);
	}
	public void removeProfessor(Professor professor) {
		professors.remove(professor);
	}
	public Classes() {
		this(null, null, null, null);
	}
	public Department getDepartment() {
		return department;
	}
	public void setDepartment(Department major) {
		this.department = major;
	}
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCourseTitle() {
		return courseTitle;
	}

	public void setCourseTitle(String courseCode) {
		this.courseTitle = courseCode;
	}
	public List<Message> getMessages() {
		return messages;
	}

	public void setMessages(ArrayList<Message> messages) {
		if(messages == null) {
			return;
		}
		this.messages = messages;
	}



	public boolean isChatEnabled() {
		return chatEnabled;
	}
	public void setChatEnabled(boolean chatEnabled) {
		this.chatEnabled = chatEnabled;
	}
}
