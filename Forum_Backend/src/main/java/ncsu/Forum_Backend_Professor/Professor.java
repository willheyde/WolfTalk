package ncsu.Forum_Backend_Professor;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import ncsu.Forum_Backend_Classes.Classes;
import ncsu.Forum_Backend_Department.Department;
import ncsu.Forum_Backend_Message.Message;
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Professor {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	private String name;
	
	private String email;
	@ManyToOne	
	@JoinColumn(name = "department_id")
    @JsonBackReference("dept-prof")
	private Department department;
	@ManyToMany(mappedBy = "professors")
	@JsonBackReference("class-prof")
	private List<Classes> classes = new ArrayList<>();
	@OneToMany
	@JsonBackReference("professor_id")
	private List<Message> messages = new ArrayList<>();
	public Professor(long id, String name, Department department) {
		super();
		this.id = id;
		this.name = name;
		this.department = department;
	}
	public Professor() {
		
	}
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Department getDepartment() {
		return department;
	}
	public void setDepartment(Department department) {
		this.department = department;
	}
	public List<Classes> getClasses() {
		return classes;
	}
	public void setClasses(Classes classe) {
		classes.add(classe);
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	};
	

}
