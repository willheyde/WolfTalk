package ncsu.Forum_Backend_User;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    
    // Fetch or provision user from Shibboleth headers
    @GetMapping("/profile")
    public ProfileDto getProfile(HttpServletRequest request) {
        String unityId     = request.getHeader("X-Shib-Eptid");
        String displayName = request.getHeader("X-Shib-FirstName");
        String email       = request.getHeader("X-Shib-Email");
        String department = "Unknown Department";
        

        if (unityId == null || unityId.isEmpty()) {
            //throw new IllegalStateException("Missing Shibboleth EPTID header");
        	unityId = "Nothin";
        }

        // Set defaults for missing attributes
        if (displayName == null || displayName.isEmpty()) {
            displayName = "Unknown User";
        }	
        if (email == null || email.isEmpty()) {
            email = "no-email@example.com";
        }

        User user = userRepository.findByUnityId(unityId);
        if (user == null) {
            user = new User(unityId, displayName, department, email, null, true);
           
        } 
        userRepository.save(user);

        return new ProfileDto(user.getId(),user.getUnityId(), user.getDisplayName(), user.getDepartment(), user.getEmail(), user.isStudent());
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/users/id/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/profile/{unityId}")
    public ResponseEntity<User> getUserByUnityId(@PathVariable String unityId) {
        Optional<User> user = Optional.ofNullable(userRepository.findByUnityId(unityId));
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/users")
    public User addUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> editUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setDisplayName(updatedUser.getDisplayName());
            user.setEmail(updatedUser.getEmail());
            user.setBio(updatedUser.getBio());
            user.setProfilePictureUrl(updatedUser.getProfilePictureUrl());
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/users/student-discussion/{unityId}")
    public ResponseEntity<?> studentArea(@PathVariable String unityId) {
        User user = userRepository.findByUnityId(unityId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        if (!user.isStudent()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Faculty cannot access student-only area.");
        }
        return ResponseEntity.ok("Welcome to student discussion!");
    }

    @PostMapping("/profile/{id}/add-friend/{friendId}")
    public ResponseEntity<String> addFriend(@PathVariable Long id, @PathVariable Long friendId) {
        Optional<User> userOpt = userRepository.findById(id);
        Optional<User> friendOpt = userRepository.findById(friendId);
        if (userOpt == null || friendOpt == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("One or both users not found");
        }
        User user = userOpt.get();
        User friend = friendOpt.get();
        if (user.getId().equals(friend.getId())) {
            return ResponseEntity.badRequest().body("You cannot befriend yourself.");
        }
        if (user.getFriends().contains(friend)) {
            return ResponseEntity.badRequest().body("You are already friends.");
        }
        user.getRequestsSent().add(friend);
        friend.getRequestsReceived().add(user);
        userRepository.save(user);
        userRepository.save(friend);

        return ResponseEntity.ok("Friend added successfully.");
    }

    @GetMapping("/profile/{id}/friends")
    public ResponseEntity<Set<User>> getFriends(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(user.getFriends()))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}/remove-friend/{friendId}")
    public ResponseEntity<String> removeFriend(@PathVariable Long id, @PathVariable Long friendId) {
        Optional<User> userOpt = userRepository.findById(id);
        Optional<User> friendOpt = userRepository.findById(friendId);
        if (userOpt.isEmpty() || friendOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("One or both users not found");
        }

        User user = userOpt.get();
        User friend = friendOpt.get();

        user.getFriends().remove(friend);
        friend.getFriends().remove(user);

        userRepository.save(user);
        userRepository.save(friend);

        return ResponseEntity.ok("Friend removed");
    }
    @GetMapping("/profile/{id}/add-friend/{friendId}")
    public ResponseEntity<String> getFriendStatus(@PathVariable Long id , @PathVariable Long friendId){
    		Optional<User> userOpt = userRepository.findById(id);
    		Optional<User> friendOpt = userRepository.findById(friendId);
    		if(userOpt.isEmpty()|| friendOpt.isEmpty()) {
    			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("One or both users not found");
    		}
    		User user = userOpt.get();
    		User friend = friendOpt.get();
    	     if(user.getRequestsSent().contains(friend)) {
    	    	 return ResponseEntity.ok("PENDING");
    	     }
    	     else if(user.getFriends().contains(friend)) {
    	    	 return ResponseEntity.ok("FRIENDS");
    	     }
    	     else {
    	    	 return ResponseEntity.ok("NONE");
    	     }
    }
    
    	

}
