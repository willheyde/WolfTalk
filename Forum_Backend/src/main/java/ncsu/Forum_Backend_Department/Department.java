package ncsu.Forum_Backend_Department;
	
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import ncsu.Forum_Backend_Classes.Classes;
import ncsu.Forum_Backend_Message.Message;
import ncsu.Forum_Backend_Professor.Professor;
import ncsu.Forum_Backend_User.User;


@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // e.g., "Computer Science"
    private String code;   // e.g., "CSC"
    private String description;

    public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	@ManyToMany
	  @JoinTable(
	    name = "department_user",
	    joinColumns = @JoinColumn(name = "department_id"),
	    inverseJoinColumns = @JoinColumn(name = "user_id")
	  )
	@JsonManagedReference("dept-users")
	private List<User> users = new ArrayList<>();   // Users that have joined or follow this department

    @OneToMany(mappedBy = "department", fetch = FetchType.EAGER)
    @JsonManagedReference("dept-prof")
    @OrderBy("name ASC")
    private Set<Professor> professors;  // Professors that teach under this department

    @OneToMany(mappedBy = "department", fetch = FetchType.EAGER)
    @JsonManagedReference("dept-class")
    @OrderBy("courseTitle ASC")
    private Set<Classes> classes; // Courses like CSC116, MA141, etc.

    @OneToMany(mappedBy = "department", fetch = FetchType.EAGER,
    cascade = CascadeType.ALL)
    @JsonManagedReference("dept-mess")
    private List<Message> messages = new ArrayList<>();; // General discussion board for the department


	public Department(Long id, String name, Set<Classes> classGroups, ArrayList<Message> messages) {
		setId(id);
		setName(name);
		setClassGroups(classGroups);
		setMessages(messages);
	}
	public Department(String name, Set<Classes> classGroups, ArrayList<Message> messages) {
		this(null, name, classGroups, messages);
	}
	public Department() {
		this(null, null, null, null);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Set<Classes> getClasses() {
		return classes;
	}

	public void setClassGroups(Set<Classes> classGroups) {
		if(classGroups == null) {
			return;
		}
		this.classes = classGroups;
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
	public void addClasses(Classes classAdd) {
		if(classAdd == null) {
			throw new IllegalArgumentException("Can't add null class");
		}
		if(classes.contains(classAdd)) {
			throw new IllegalArgumentException("Can't add duplicate class");
		}
		classes.add(classAdd);
	}
	public void removeClasses(Classes classRemove) {
		classes.remove(classRemove);
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public List<User> getUsers() {
		return users;
	}
	public void setUsers(List<User> users) {
		this.users = users;
	}
	public Set<Professor> getProfessors() {
		return professors;
	}
	public void addProfessors(Professor professor) {
		professors.add(professor);
	}
	public void setClasses(Classes classe) {
		classes.add(classe);
	}
	public void setMessages(Message message) {
		messages.add(message);
	}


}
