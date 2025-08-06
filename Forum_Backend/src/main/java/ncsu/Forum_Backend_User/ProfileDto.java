// src/main/java/ncsu/Forum_Backend_User/ProfileDto.java
package ncsu.Forum_Backend_User;

public class ProfileDto {
	private Long id;
    private String unityId;
    private String displayName;
    private String department;
    private String email;
    private boolean isStudent;

    public ProfileDto() { }

    public ProfileDto(Long id, String unityId, String displayName, String department, String email, boolean isStudent) {
    	this.id = id;
        this.unityId      = unityId;
        this.displayName  = displayName;
        this.department   = department;
        this.email        = email;
        this.isStudent = isStudent;
    }

    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUnityId()      { return unityId; }
    public String getDisplayName()  { return displayName; }
    public String getDepartment()   { return department; }
    public String getEmail()        { return email; }
    

    public boolean getIsStudent() {
		return isStudent;
	}

	public void setStudent(boolean isStudent) {
		this.isStudent = isStudent;
	}

	public void setUnityId(String unityId)         { this.unityId = unityId; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public void setDepartment(String department)   { this.department = department; }
    public void setEmail(String email)             { this.email = email; }
}
